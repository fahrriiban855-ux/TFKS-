#!/usr/bin/env python3
"""Apply the TFKS repair-kit files to a clean checkout of the inspected base commit."""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

BASE_COMMIT = "c7b3c051452c8567325111a18e9f3f295a21a468"
SCRIPT_DIR = Path(__file__).resolve().parent
REPLACEMENTS = SCRIPT_DIR / "replacements"
EXTRA_FILES = {SCRIPT_DIR / "docs" / "REPAIR-NOTES.md": Path("docs/REPAIR-NOTES.md")}


def run_git(repo: Path, *args: str) -> str:
    proc = subprocess.run(
        ["git", *args], cwd=repo, text=True, stdout=subprocess.PIPE,
        stderr=subprocess.PIPE, check=False
    )
    if proc.returncode:
        raise RuntimeError(proc.stderr.strip() or f"git {' '.join(args)} failed")
    return proc.stdout.strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("repo", nargs="?", default=".", help="Path to a TFKS checkout")
    parser.add_argument(
        "--allow-different-head", action="store_true",
        help="Apply to a different commit after manually reviewing changes (not recommended).",
    )
    args = parser.parse_args()
    repo = Path(args.repo).resolve()

    try:
        root = Path(run_git(repo, "rev-parse", "--show-toplevel"))
        head = run_git(root, "rev-parse", "HEAD")
        status = run_git(root, "status", "--porcelain")
    except Exception as exc:
        print(f"ERROR: Could not verify a Git checkout: {exc}", file=sys.stderr)
        return 2

    if root != repo:
        print(f"ERROR: Pass the repository root, not {repo}. Git root is {root}.", file=sys.stderr)
        return 2
    if status:
        print("ERROR: Working tree is not clean. Commit or back up local changes before applying.", file=sys.stderr)
        print(status, file=sys.stderr)
        return 2
    if head != BASE_COMMIT and not args.allow_different_head:
        print("ERROR: This repair kit targets a different base commit.", file=sys.stderr)
        print(f"Expected: {BASE_COMMIT}\nFound:    {head}", file=sys.stderr)
        print("Inspect the diff first. Use --allow-different-head only after reviewing conflicts.", file=sys.stderr)
        return 2

    # Apply this small test-runner improvement only if the inspected baseline still matches.
    platform_test = root / "src/tests/platform.test.ts"
    try:
        platform_source = platform_test.read_text(encoding="utf-8")
    except OSError as exc:
        print(f"ERROR: Could not read {platform_test}: {exc}", file=sys.stderr)
        return 2
    old_runner = """function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`, err);
    process.exit(1);
  }
}
"""
    new_runner = """let testGroupCount = 0;
let failedTestGroupCount = 0;

function runTest(name: string, fn: () => void) {
  testGroupCount += 1;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
  } catch (err) {
    failedTestGroupCount += 1;
    console.error(`❌ [FAIL] ${name}`, err);
  }
}
"""
    old_summary = "console.log('\\n🎉 TÜM TESTLER (8/8 GRUP, 42 EKRAN & M0 %0 KOMİSYON KURALI) BAŞARIYLA GEÇTİ!');"
    new_summary = (
        "console.log(`\\nTest grupları: ${testGroupCount - failedTestGroupCount}/${testGroupCount} geçti; ${failedTestGroupCount} başarısız.`);"
        "\nif (failedTestGroupCount > 0) process.exitCode = 1;"
    )
    if old_runner not in platform_source or old_summary not in platform_source:
        print("ERROR: src/tests/platform.test.ts differs from the inspected baseline; refusing to patch blindly.", file=sys.stderr)
        return 2

    copies: list[tuple[Path, Path]] = []
    for source in REPLACEMENTS.rglob("*"):
        if source.is_file():
            relative = source.relative_to(REPLACEMENTS)
            copies.append((source, relative))
    for source, relative in EXTRA_FILES.items():
        if source.is_file():
            copies.append((source, relative))

    backup_root = root.parent / f"{root.name}-backup-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}"
    backup_root.mkdir(parents=True, exist_ok=False)
    changed: list[str] = []
    for source, relative in copies:
        destination = root / relative
        if destination.exists():
            backup = backup_root / relative
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(destination, backup)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        changed.append(relative.as_posix())

    patched_platform_test = platform_source.replace(old_runner, new_runner, 1).replace(old_summary, new_summary, 1)
    platform_backup = backup_root / "src/tests/platform.test.ts"
    platform_backup.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(platform_test, platform_backup)
    platform_test.write_text(patched_platform_test, encoding="utf-8")
    changed.append("src/tests/platform.test.ts (runner continues after failures)")

    print(f"Backup directory: {backup_root}")
    print("Updated files:")
    for path in changed:
        print(f"  {path}")

    diff_check = subprocess.run(["git", "diff", "--check"], cwd=root, check=False)
    if diff_check.returncode:
        print("ERROR: git diff --check failed. Review the working tree before continuing.", file=sys.stderr)
        return diff_check.returncode

    print("\nPatch copied. No commit was created.")
    print("Next run: bun install --frozen-lockfile && bun run lint && bun run test && bun run build")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
