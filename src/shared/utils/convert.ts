import ConflictException from "../exceptions/Conflict.exception"

export function isDate<T extends boolean>(
    date: unknown,
    throwE: T,
): T extends true ? Date : Date | null {
    if (!(typeof date === "string" || typeof date === "number" || date instanceof Date)) {
        if (throwE) {
            throw new ConflictException("Invalid date, received: " + date)
        }
        return null as T extends true ? Date : Date | null
    }

    const parsedDate = new Date(typeof date == "string" ? date.replace("-03:00", "") : date)

    if (isNaN(parsedDate.getTime())) {
        if (throwE) {
            throw new ConflictException("Invalid date, received: " + date)
        }
        return null as T extends true ? Date : Date | null
    }

    return parsedDate as T extends true ? Date : Date
}

export function isNumber<T extends boolean>(
    num: unknown,
    throwE: T,
): T extends true ? number : number | null {
    if (typeof num === "number" && !isNaN(num)) {
        return num as T extends true ? number : number
    } else if (typeof num === "string" && !isNaN(parseInt(num))) {
        return parseInt(num) as T extends true ? number : number
    } else {
        if (throwE) {
            throw new ConflictException("Invalid number, received: " + num)
        }
        return null as T extends true ? number : number | null
    }
}

export function isString<T extends boolean>(
    str: unknown,
    throwE: T,
): T extends true ? string : string | null {
    if (typeof str === "string") {
        return str as T extends true ? string : string
    } else if (typeof str === "number") {
        return str.toString() as T extends true ? string : string
    } else {
        if (throwE) {
            throw new ConflictException("Invalid string, received: " + str)
        }
        return null as T extends true ? string : string | null
    }
}
