String.prototype.HTML2WA = function () {
    const html = String(this)
    return html
        .replace(/<h[^>]*>(.*?)<\/h[^>]*>/g, (found, replaced) => { return `*${replaced.trim()}*` })
        .replace(/<b>(.*?)<\/b>/g, (found, replaced) => { return `*${replaced.trim()}*` })
        .replace(/<strong>(.*?)<\/strong>/g, (found, replaced) => { return `*${replaced.trim()}*` })
        .replace(/<i>(.*?)<\/i>/g, (found, replaced) => { return `_${replaced.trim()}_` })
        .replace(/<em>(.*?)<\/em>/g, (found, replaced) => { return `_${replaced.trim()}_` })
        .replace(/<s>(.*?)<\/s>/g, (found, replaced) => { return `~${replaced.trim()}~` })
        .replace(/<code>(.*?)<\/code>/g, (found, replaced) => { return '```' + replaced.trim() + '```' })
        .replace(/<pre>(.*?)<\/pre>/g, (found, replaced) => { return '```' + replaced.trim() + '```' })
        .replace(/<[^>]*>?/gm, '')
        .trim()
}

String.prototype.WA2HTML = function () {
    const string = String(this)
    return string
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        .replace(/```(.*?)```/g, '<code>$1</code>')
        .replace(/~(.*?)~/g, '<s>$1</s>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
}