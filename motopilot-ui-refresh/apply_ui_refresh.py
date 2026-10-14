#!/usr/bin/env python3
"""Apply the MotoPilot visible UI refresh to an existing TFKS/MotoPilot checkout."""
from __future__ import annotations
import argparse
import datetime as dt
import shutil
import subprocess
import sys
from pathlib import Path

IMPORT_LINE = "import './premium-refresh.css';"
ANCHOR = "import './index.css';"


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply the MotoPilot UI refresh stylesheet.")
    parser.add_argument("repo", help="Path to the local TFKS-/MotoPilot repository")
    parser.add_argument("--allow-dirty", action="store_true", help="Continue even if git working tree has local changes")
    args = parser.parse_args()
    repo = Path(args.repo).expanduser().resolve()
    main_file = repo / "src" / "main.tsx"
    style_source = Path(__file__).resolve().parent / "premium-refresh.css"
    style_target = repo / "src" / "premium-refresh.css"

    if not (repo / ".git").exists() or not main_file.is_file():
        print("HATA: Bu klasör geçerli bir Git deposu değil veya src/main.tsx bulunamadı.", file=sys.stderr)
        return 2
    if not style_source.is_file():
        print("HATA: premium-refresh.css paket içinde bulunamadı.", file=sys.stderr)
        return 2

    status = subprocess.run(["git", "status", "--porcelain"], cwd=repo, text=True, capture_output=True)
    if status.returncode != 0:
        print("HATA: Git çalışma durumu okunamadı.", file=sys.stderr)
        return 2
    if status.stdout.strip() and not args.allow_dirty:
        print("HATA: Depoda kaydedilmemiş değişiklikler var. Önce commit/backup alın veya --allow-dirty kullanın.", file=sys.stderr)
        print(status.stdout, file=sys.stderr)
        return 3

    main_text = main_file.read_text(encoding="utf-8")
    if IMPORT_LINE in main_text and style_target.exists():
        print("UI yenilemesi zaten uygulanmış görünüyor; değişiklik yapılmadı.")
        return 0
    if ANCHOR not in main_text:
        print("HATA: src/main.tsx beklenen import satırını içermiyor; otomatik değişiklik durduruldu.", file=sys.stderr)
        return 4
    if style_target.exists():
        print("HATA: src/premium-refresh.css zaten var; dosyanın üzerine yazılmadı.", file=sys.stderr)
        return 4

    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_dir = repo.parent / f"{repo.name}-ui-backup-{stamp}"
    backup_dir.mkdir(parents=True, exist_ok=False)
    shutil.copy2(main_file, backup_dir / "main.tsx.before-ui-refresh")

    try:
        updated = main_text.replace(ANCHOR, ANCHOR + "\n" + IMPORT_LINE, 1)
        style_target.write_text(style_source.read_text(encoding="utf-8"), encoding="utf-8")
        main_file.write_text(updated, encoding="utf-8")
    except Exception:
        if style_target.exists():
            style_target.unlink()
        shutil.copy2(backup_dir / "main.tsx.before-ui-refresh", main_file)
        raise

    print("MotoPilot görünür UI yenilemesi uygulandı.")
    print(f"Eklenen: {style_target}")
    print(f"Güncellenen: {main_file}")
    print(f"Yedek: {backup_dir}")
    print("Değişiklikleri tarayıcıda doğrulayın; kod testleri/derleme bu betik tarafından çalıştırılmaz.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
