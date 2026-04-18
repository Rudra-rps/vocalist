from __future__ import annotations

import argparse
import json
import time

from demo_mode import DemoRunner, list_scenarios


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run Smart DJ Booth demo mode without hardware."
    )
    parser.add_argument(
        "--scenario",
        default="peak_hour",
        help="Scenario key to run.",
    )
    parser.add_argument(
        "--ticks",
        type=int,
        default=30,
        help="Number of samples to generate.",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=0.35,
        help="Seconds between samples.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit JSON lines instead of serial-style text.",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List the available demo scenarios and exit.",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if args.list:
        for scenario in list_scenarios():
            print(f"{scenario.key}: {scenario.description}")
        return 0

    runner = DemoRunner(args.scenario)
    for frame in runner.frames(args.ticks):
        if args.json:
            print(json.dumps(frame.to_dict()))
        else:
            print(frame.to_serial_line())
        time.sleep(max(args.interval, 0.0))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

