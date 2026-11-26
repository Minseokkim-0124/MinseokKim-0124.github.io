"""Compatibility entry point for the official Magic Portfolio export checker."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).resolve().parents[1] / "site/scripts/check_export.py"), run_name="__main__")
