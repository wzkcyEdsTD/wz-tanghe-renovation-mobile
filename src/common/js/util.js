const conver = (s) => {
    return s < 10 ? '0' + s : s
}

export const getDate = () => {
    const date = new Date();
    // 获取当前年
    const year = date.getFullYear();
    // 获取当前月
    const month = conver(date.getMonth() + 1);
    // 获取当前日
    const day = conver(date.getDate());
    const h = conver(date.getHours());
    const m = conver(date.getMinutes());
    const s = conver(date.getSeconds());
    // 获取当前时间
    return `${year}年${month}月${day}日@${h}:${m}:${s}`;
}


// 深拷贝
export const deepClone = (obj) => {
    if (!obj || !(obj instanceof Object) || typeof obj == "function") {
        return obj || undefined;
    }
    const constructor = obj.constructor;
    const result = new constructor();
    for (let key in obj) {
        if (key in obj) {
            result[key] = deepClone(obj[key]);
        }
    }
    return result;
}