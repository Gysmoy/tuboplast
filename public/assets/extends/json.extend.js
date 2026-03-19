JSON.parseable = function (text) {
    try {
        let json = JSON.parse(text);
        return json;
    } catch (error) {
        return false;
    }
};

JSON.flatten = function (array, notation = '.', prefix = '') {
    let flattened = {};
    for (let key in array) {
        let new_key = Number.isInteger(Number(key)) ? '[' + key + ']' : (prefix === '' ? key : notation + key);
        if (Array.isArray(array[key]) || typeof array[key] === 'object') {
            let temp = JSON.flatten(array[key], notation, prefix + new_key);
            for (let temp_key in temp) {
                flattened[temp_key] = temp[temp_key];
            }
        } else {
            flattened[prefix + new_key] = array[key];
        }
    }
    return flattened;
}

JSON.unflatten = function (obj, notation = '.') {
    let result = {};
    for (let key in obj) {
        let keys = key.split(notation);
        keys = keys.map(k => k.replace(/\\./g, '.').replace(/\\\[/g, '[').replace(/\\\]/g, ']'));
        let cur = result;
        for (let i = 0; i < keys.length; i++) {
            let prop = keys[i];
            if (prop.includes('[') && prop.endsWith(']')) {
                let index = parseInt(prop.slice(prop.indexOf('[') + 1, prop.length - 1));
                prop = prop.slice(0, prop.indexOf('['));
                if (!cur[prop]) {
                    cur[prop] = [];
                }
                while (cur[prop].length <= index) {
                    cur[prop].push({});
                }
                if (i === keys.length - 1) {
                    cur[prop][index] = obj[key];
                } else {
                    if (!cur[prop][index]) {
                        cur[prop][index] = {};
                    }
                    cur = cur[prop][index];
                }
            } else {
                if (i === keys.length - 1) {
                    cur[prop] = obj[key];
                } else {
                    if (!cur[prop]) {
                        cur[prop] = {};
                    }
                    cur = cur[prop];
                }
            }
        }
    }
    return result;
}

JSON.take = function (obj, quantity) {
    return obj.slice(0, quantity);
}

JSON.fromCSV = function (csv, separator = ',', isNested = false) {
    const lineas = String(csv).trim().split('\n');
    const resultado = [];
    let regex = new RegExp('[^a-zA-Z0-9ÑñÁáÉéÍíÓóÚúÜü\\s]', 'g');
    const encabezados = lineas[0].split(separator).map(item => {
        return isNested
            ? item.split('.').map(x => x.trim()).filter(Boolean).join('.')
            : item.replace(regex, '')
                .split(' ')
                .filter(Boolean)
                .join(' ').trim()
    });

    const regexp = new RegExp(`${separator}(?=(?:(?:[^"]*"){2})*[^"]*$)`)

    for (let i = 1; i < lineas.length; i++) {
        const obj = {};
        const filaActual = lineas[i].split(regexp)
            .map(item => item.trim().replace(/^"(.*)"$/, '$1'));

        if (filaActual.some(dato => dato !== '')) {
            for (let j = 0; j < encabezados.length; j++) {
                obj[encabezados[j]] = filaActual[j];
            }
            resultado.push(obj);
        }
    }
    return resultado;
}

JSON.isNested = function (object) {
    for (const key in object) {
        const value = object[key];
        if (value != null && typeof value == 'object') return true
    }
    return false
}