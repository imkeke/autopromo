#!/bin/sh
DIR=`pwd`
NODE=`which node`

# get action
ACTION=$1

get_pid() {
  if [ -f ./run/app.pid ]; then
    echo `cat ./run/app.pid`
  fi
}

start() {
  pid=`get_pid`
  if [ ! -z $pid ]; then
    echo 'server is already running'
  else
    nohup $NODE $DIR/app.js 2>&1 &
    echo 'server is running'
  fi
}

stop() {
  pid=`get_pid`
  if [ -z $pid ]; then
    echo 'server not running'
  else
    echo "server is stopping ..."
    kill -15 $pid
    echo "server stopped !"
  fi
}

restart() {
  stop
  sleep 0.5
  echo ========
  start
}

case "$ACTION" in
  start)
    start
  ;;
  stop)
    stop
  ;;
  restart)
    restart
  ;;
  *)
    echo "Usage: ./appctl.sh {start|stop|restart}"
  ;;
esac
