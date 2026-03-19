class Notify {
    static container = () => {
        let e = document.createElement('div');
        e.id = 'notify_container';
        e.style.position = 'fixed';
        e.style.display = 'grid';
        e.style.gap = '10px';
        e.style.padding = 0;
        e.style.top = '20px';
        e.style.right = '20px';
        e.style.spacing = '5px';
        e.style.height = 'max-content';
        e.style.zIndex = 999999;
        return e;
    }
    static template(title, icon, body, type, timeout, clicked) {
        let color = '247, 247, 247';
        switch (type) {
            case 'primary':
                color = '113, 182, 249';
                break;
            case 'success':
                color = '16, 196, 105';
                break;
            case 'info':
                color = '53, 184, 224';
                break;
            case 'warning':
                color = '249,200,81';
                break;
            case 'danger':
                color = '255, 91, 91';
                break;
        }
        let a = document.createElement('a');
        a.style.fontFamily = 'Poppins,sans-serif';
        a.style.width = '320px';
        a.style.margin = 0;
        a.style.padding = 0;
        a.style.backgroundColor = `rgba(${color}, .18)`;
        a.style.backdropFilter = 'blur(40px)';
        a.style.border = `1px solid rgba(${color}, .12)`;
        a.style.borderRadius = '7.5px';
        a.style.display = 'block';
        a.style.userSelect = 'none';
        a.style.color = `rgb(${color})`;
        a.style.cursor = 'pointer';
        a.style.transition = '0.25s';

        let table = document.createElement('table');
        table.style.borderSpacing = '0';

        let tbody = document.createElement('tbody');

        let tr1 = document.createElement('tr');

        let td00 = document.createElement('td');
        td00.rowSpan = 2;
        td00.style.padding = '10px 10px 10px 15px';
        td00.style.verticalAlign = 'middle';

        let img = document.createElement('img');
        img.src = icon;
        img.width = 30;
        img.height = 30;
        img.style.margin = 0;

        td00.innerHTML = img.outerHTML;

        tr1.append(td00);

        let td01 = document.createElement('td');
        td01.style.padding = '10px 15px 5px 0px';

        var span = document.createElement('span');
        span.style.display = 'block';
        span.style.fontWeight = 'bold';
        span.style.fontSize = '14px';
        span.style.letterSpacing = 'normal !important';
        span.style.width = '240px';
        span.style.whiteSpace = 'nowrap';
        span.style.textOverflow = 'ellipsis';
        span.style.overflow = 'hidden';
        span.innerText = title;

        td01.innerHTML = span.outerHTML;
        tr1.append(td01);

        tbody.append(tr1);

        let tr2 = document.createElement('tr');

        let td11 = document.createElement('td');

        td11.style.padding = '0px 15px 10px 0px';

        var span = document.createElement('span');
        span.style.display = 'block';
        span.style.fontSize = '14px';
        span.style.letterSpacing = 'normal !important';
        span.style.color = `rgba(${color}, .825)`;
        span.style.textOverflow = 'none';
        span.style.wordWrap = 'break-word';
        span.innerText = body;

        td11.innerHTML = span.outerHTML;

        tr2.innerHTML = td11.outerHTML;
        tbody.append(tr2);

        table.innerHTML = tbody.outerHTML;
        a.innerHTML = table.outerHTML;

        a.addEventListener('click', function () {
            clicked();
            a.style.opacity = 0;
            setTimeout(() => {
                a.remove();
            }, 250);
        });
        setTimeout(() => {
            a.style.opacity = 0;
            setTimeout(() => {
                a.remove();
            }, 250);
        }, timeout);

        return a;
    }

    static add({
        title = 'Notify está listo',
        icon = 'https://sode.me/img/icons/sode.icon.svg',
        body = 'Propiedad de DevEx Consulting',
        type = 'success',
        timeout = 8000,
        clicked = () => { console.log('Has hecho clic sobre la notificación de DevEx Consulting') }
    } = {}) {
        if (!document.getElementById('notify_container')) {
            document.body.appendChild(this.container());
        }
        let div = document.getElementById('notify_container');
        div.prepend(this.template(title, icon, body, type, timeout, clicked));
    }
}