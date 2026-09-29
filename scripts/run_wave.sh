#!/bin/bash
# Sequential-ish runner with limited parallelism + retry
IN="$1"          # file with key|query lines
P="${2:-3}"      # parallelism
run() {
  local line="$1" key q
  key="${line%%|*}"; q="${line#*|}"
  for attempt in 1 2 3; do
    out=$(bash /home/z/my-project/scripts/search_one.sh "$key" "$q")
    echo "$out"
    case "$out" in OK*|SKIP*) return;; esac
    sleep $((attempt*8))
  done
}
export -f run
xargs -a "$IN" -P "$P" -I{} bash -c 'run "{}"'
echo "WAVE_COMPLETE"
