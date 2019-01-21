const _ = require('underscore');
const {shell} = require('electron');
const path = require('path');
const notifier = require('node-notifier');

let notify = ({title, desc, filePath, success, repeat}) => {
    let timeoutId = '';

    let option = {
        title: title || '该复习了',
        body: desc,
        icon: path.join(__dirname, '../../../assets/img/programming.png')
    }

    if (!window || _.isUndefined(window)) {
        notifier.notify({
            title: title,
            subtitle: desc,
        });
        return
    }

    const myNotification = new window.Notification(option.title, option)

    if (repeat === true) {
        myNotification.onshow = () => {
            timeoutId = setTimeout(() => {
                notify({filePath, title, desc});
            }, 1000 * 60)
        }
    }

    myNotification.onclick = () => {
        clearTimeout(timeoutId);
        // 如果有跳转链接的话，则跳转
        if (_.isUndefined(shell)) {
            throw new Error('shell is not defined')
            return next()
        }
        if (!_.isUndefined(filePath)) {
            shell.openItem(filePath);
        }
        if (!_.isUndefined(success) && typeof success === 'function') {
            success();
        }
    }
}

export {notify};
