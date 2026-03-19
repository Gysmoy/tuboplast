const getImageTargetByMimeType = mimeType => {
    const img = document.createElement('img')
    if (mimeType == 'text/plain') {
        img.src = `//${DOMAIN}/img/utils/txt.util.svg`
    } else if (mimeType == 'apllication/json') {
        img.src = `//${DOMAIN}/img/utils/json.util.svg`
    } else if (mimeType == 'application/vnd.ms-excel' || mimeType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        img.src = `//${DOMAIN}/img/utils/xls.util.svg`
    } else if (mimeType == 'application/pdf') {
        img.src = `//${DOMAIN}/img/utils/pdf.util.svg`
    } else if (mimeType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType == 'application/msword') {
        img.src = `//${DOMAIN}/img/utils/doc.util.svg`
    } else if (mimeType == 'application/zip' || mimeType == 'application/x-7z-compressed') {
        img.src = `//${DOMAIN}/img/utils/zip.util.svg`
    } else if (mimeType == 'application/x-rar-compressed') {
        img.src = `//${DOMAIN}/img/utils/rar.util.svg`
    } else if (mimeType == 'image/jpeg' || mimeType == 'image/png' || mimeType == 'image/gif' || mimeType == 'image/svg+xml') {
        img.src = `//${DOMAIN}/img/utils/img.util.svg`
    } else if (mimeType == 'video/mp4' || mimeType == 'video/ogg' || mimeType == 'video/webm') {
        img.src = `//${DOMAIN}/img/utils/video.util.svg`
    } else if (mimeType == 'audio/mpeg' || mimeType == 'audio/ogg' || mimeType == 'audio/wav') {
        img.src = `//${DOMAIN}/img/utils/audio.util.svg`
    } else if (mimeType == 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || mimeType == 'application/vnd.ms-powerpoint') {
        img.src = `//${DOMAIN}/img/utils/ppt.util.svg`
    } else if (mimeType == 'application/vnd.oasis.opendocument.presentation' || mimeType == 'application/vnd.oasis.opendocument.spreadsheet' || mimeType == 'application/vnd.oasis.opendocument.text') {
        img.src = `//${DOMAIN}/img/utils/odt.util.svg`
    } else if (mimeType == 'application/x-shockwave-flash') {
        img.src = `//${DOMAIN}/img/utils/swf.util.svg`
    } else if (mimeType == 'application/octet-stream') {
        img.src = `//${DOMAIN}/img/utils/bin.util.svg`
    } else if (mimeType == 'application/x-msdownload') {
        img.src = `//${DOMAIN}/img/utils/exe.util.svg`
    } else if (mimeType == 'application/x-msdos-program') {
        img.src = `//${DOMAIN}/img/utils/msdos.util.svg`
    } else {
        img.src = `//${DOMAIN}/img/utils/unknown.util.svg`
    }

    return img
}
