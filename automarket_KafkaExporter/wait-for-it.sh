#!/usr/bin/env bash
# wait-for-it.sh

set -e

host="$1"
shift
port="$1"
shift

timeout=120 # Default timeout in seconds
quiet=0

while [[ "$1" != "" ]]; do
    case "$1" in
        --timeout=*)
            timeout="${1#*=}"
            shift
            ;;
        --quiet)
            quiet=1
            shift
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

start_ts=$(date +%s)
end_ts=$((start_ts + timeout))

while :
do
    if nc -z "$host" "$port"; then
        if [[ "$quiet" -ne 1 ]]; then
            echo "Kafka está activo en $host:$port. Esperando 1 minuto más..."
        fi
        sleep 60
        break
    fi

    now_ts=$(date +%s)
    if [[ "$now_ts" -ge "$end_ts" ]]; then
        echo "Timeout after $timeout seconds waiting for $host:$port"
        exit 1
    fi

    if [[ "$quiet" -ne 1 ]]; then
        echo "Waiting for $host:$port..."
    fi

    sleep 10
done

exec "$@"
