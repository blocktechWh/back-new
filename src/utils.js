// 观察者模式
export const eventProxy = {
    onObj: {},
    oneObj: {},
    on: function (key, fn) {
        if (this.onObj[key] === undefined) {
            this.onObj[key] = [];
        }

        this.onObj[key].push(fn);
    },
    one: function (key, fn) {
        if (this.oneObj[key] === undefined) {
            this.oneObj[key] = [];
        }

        this.oneObj[key].push(fn);
    },
    off: function (key) {
        this.onObj[key] = [];
        this.oneObj[key] = [];
    },
    trigger: function () {
        let key, args;
        if (arguments.length === 0) {
            return false;
        }
        key = arguments[0];
        args = [].concat(Array.prototype.slice.call(arguments, 1));

        if (this.onObj[key] !== undefined && this.onObj[key].length > 0) {
            for (let i in this.onObj[key]) {
                this.onObj[key][i].apply(null, args);
            }
        }
        if (this.oneObj[key] !== undefined && this.oneObj[key].length > 0) {
            for (let i in this.oneObj[key]) {
                this.oneObj[key][i].apply(null, args);
                this.oneObj[key][i] = undefined;
            }
            this.oneObj[key] = [];
        }
    }
}

// 日期时间格式化
export const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    let padStr = n => {
        return n.toString().padStart(2, '0');
    }

    return [year, month, day].map(padStr).join('-') + ' ' + [hour, minute, second].map(padStr).join(':')
}

// 条件比较符
export const Oper = {
    like: 'OPER_LIKE',
    leftLike: 'OPER_LIKE_LEFT',
    rightLike: 'OPER_LIKE_RIGHT',
    notLike: 'OPER_NOT_LIKE',

    equal: 'OPER_EQUAL',
    big: 'OPER_BIG',
    small: 'OPER_SMALL',
    bigEqual: 'OPER_BIG_EQUAL',
    smallEqual: 'OPER_SMALL_EQUAL',
    noEqual: 'OPER_NO_EQUAL',

    after: 'OPER_BIG_EQUAL_DATE',
    before: 'OPER_SMALL_EQUAL_DATE',

    in: 'OPER_IN',
    notIn: 'OPER_NOT_IN',
}

// 查询条件
class Condition {
    constructor(field, value = '', oper = Oper.equal) {
        this.field = field;
        this.value = value;
        this.oper = oper;
    }
};
export class And {
    constructor(...args) {
        this.combo = 'and';
        this.conditions = [];
        this.conditions.push(new Condition(...args));
    }

    add(...args) {
        if (args.length === 1) {
            this.conditions.push(args);
        } else {
            this.conditions.push(new Condition(...args));
        }
    }
}
export class Or extends And {
    constructor(...args) {
        super(...args);
        this.combo = 'or';
    }
}
export class Order {
    constructor(field, value = 'asc') {
        if (value !== 'desc') {
            value = 'asc';
        }

        this.combo = 'order';
        this.field = field;
        this.value = value;
    }
}
