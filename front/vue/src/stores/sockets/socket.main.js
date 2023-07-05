import {defineStore} from "pinia";
import {toast} from "vue3-toastify";
import {io} from "socket.io-client";
import MyLog from "@/helpers/myLog";


export const useSocketMainStore = defineStore('socket.main', {
    state: () => ({
        isConnect: false, // Флаг, который говорит, есть ли соединение
        socket: null // Сам объект для соединения
    }),
    actions: {
        /**
         * Процесс установки соединения
         */
        connect() {
            if (this.isConnect) return
            this.socket = io('/')
            this.isConnect = true

            // Реакция на сообщение с сервера
            this.socket.on('socket.myNameIs', (data) => {
                toast.success('Connect to: ' + data)
            })

            //Реакция на любое сообщение
            this.socket.on('message', (data) => {
                MyLog('Catch message from server:', data);
            });

            // Пинг с сервера
            this.socket.on('ping', (data) => {
                MyLog('ping from server:', data);
            });

            // Реакция на отключение связи
            this.socket.on('disconnect', (data) => {
                toast.error(data)
                this.isConnect = false
            })

        },
        on(eventName, callBack){
            this.socket.on(eventName, callBack);

        },
        off(eventName, callBack){
            this.socket.off(eventName, callBack)
        }
    }
})
