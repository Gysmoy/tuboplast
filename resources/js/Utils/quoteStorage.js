import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const QUOTE_STORAGE_KEY = 'tuboplast:quote-items';
const QUOTE_UPDATED_EVENT = 'quote:updated';
const QUOTE_OPEN_EVENT = 'quote:open';

const safeParse = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const readQuoteItems = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  return safeParse(window.localStorage.getItem(QUOTE_STORAGE_KEY) ?? '[]');
};

export const writeQuoteItems = (items) => {
  if (typeof window === 'undefined') {
    return items;
  }

  window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(QUOTE_UPDATED_EVENT, { detail: { items } }));

  return items;
};

export const addQuoteItem = (product, quantity = 1) => {
  const currentItems = readQuoteItems();
  const quoteKey = product.sku ?? product.id ?? product.detailUrl ?? product.title;
  const existingIndex = currentItems.findIndex((item) => item.quoteKey === quoteKey);
  const normalizedQuantity = Math.max(1, Number(quantity) || 1);

  let nextItems;

  if (existingIndex >= 0) {
    nextItems = currentItems.map((item, index) => (
      index === existingIndex
        ? { ...item, quantity: item.quantity + normalizedQuantity }
        : item
    ));
  } else {
    nextItems = [
      ...currentItems,
      {
        quoteKey,
        sku: product.sku ?? '',
        title: product.title,
        image: product.image ?? '',
        detailUrl: product.detailUrl ?? '',
        quantity: normalizedQuantity,
        unitPrice: product.unitPrice ?? null,
        priceLabel: product.price ?? null,
        currency: product.currency ?? 'PEN',
      },
    ];
  }

  return writeQuoteItems(nextItems);
};

export const updateQuoteItemQuantity = (quoteKey, quantity) => {
  const normalizedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const currentItems = readQuoteItems();

  return writeQuoteItems(
    currentItems.map((item) => (
      item.quoteKey === quoteKey
        ? { ...item, quantity: normalizedQuantity }
        : item
    )),
  );
};

export const removeQuoteItem = (quoteKey) => {
  const currentItems = readQuoteItems();
  return writeQuoteItems(currentItems.filter((item) => item.quoteKey !== quoteKey));
};

export const clearQuoteItems = () => writeQuoteItems([]);

export const openQuotePanel = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(QUOTE_OPEN_EVENT));
};

export const subscribeToQuoteChanges = (handler) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleUpdated = (event) => {
    handler(event.detail?.items ?? readQuoteItems());
  };

  const handleStorage = (event) => {
    if (event.key === QUOTE_STORAGE_KEY) {
      handler(readQuoteItems());
    }
  };

  window.addEventListener(QUOTE_UPDATED_EVENT, handleUpdated);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(QUOTE_UPDATED_EVENT, handleUpdated);
    window.removeEventListener('storage', handleStorage);
  };
};

export const subscribeToQuotePanelOpen = (handler) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(QUOTE_OPEN_EVENT, handler);
  return () => window.removeEventListener(QUOTE_OPEN_EVENT, handler);
};

const currencySymbol = (currency) => (String(currency ?? 'PEN').toUpperCase() === 'USD' ? '$ ' : 'S/ ');

const formatProductPrice = (product) => (
  product.unitPrice != null
    ? `${currencySymbol(product.currency)}${Number(product.unitPrice).toFixed(2)}`
    : (product.price ?? '-')
);

export const buildTechnicalSheetText = (product, quantity = 1) => {
  const summaryLines = Array.isArray(product.summary)
    ? product.summary.map((item) => `${item.label}: ${item.value}`).join('\n')
    : '';

  const specLines = Array.isArray(product.technicalSpecifications)
    ? product.technicalSpecifications
        .map((group) => {
          const items = Array.isArray(group.items)
            ? group.items.map((item) => `  - ${item.label}: ${item.value}`).join('\n')
            : '';
          const badges = Array.isArray(group.badges) && group.badges.length
            ? `\n  Etiquetas: ${group.badges.join(', ')}`
            : '';

          return `${group.title}\n${items}${badges}`;
        })
        .join('\n\n')
    : '';

  return [
    `Ficha tecnica: ${product.title}`,
    `SKU: ${product.sku ?? '-'}`,
    `Cantidad solicitada: ${quantity}`,
    `Categoria: ${product.categoryLabel ?? product.category ?? '-'}`,
    `Precio unitario: ${formatProductPrice(product)}`,
    '',
    'Descripcion',
    product.description ?? '-',
    '',
    'Resumen',
    summaryLines || '-',
    '',
    'Especificaciones tecnicas',
    specLines || '-',
    '',
    `Norma: ${product.standard ?? '-'}`,
    `Stock: ${product.stockLabel ?? '-'}`,
  ].join('\n');
};

const getSpecRows = (product) => {
  const rows = [];

  if (Array.isArray(product.summary)) {
    product.summary.forEach((item) => {
      rows.push([item.label, item.value]);
    });
  }

  if (Array.isArray(product.technicalSpecifications)) {
    product.technicalSpecifications.forEach((group) => {
      rows.push([{ content: group.title, colSpan: 2, styles: { fillColor: [230, 238, 248] } }]);

      if (Array.isArray(group.items)) {
        group.items.forEach((item) => {
          rows.push([item.label, item.value]);
        });
      }

      if (Array.isArray(group.badges) && group.badges.length) {
        rows.push(['Etiquetas', group.badges.join(', ')]);
      }
    });
  }

  return rows;
};

const formatFileName = (value) => (
  `${(value ?? 'ficha-tecnica')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}.pdf`
);

export const downloadTechnicalSheet = (product, quantity = 1) => {
  if (typeof window === 'undefined') {
    return;
  }

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 16;
  let cursorY = 18;

  doc.setFillColor(4, 53, 110);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Tuboplast', left, 14);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Ficha tecnica del producto', left, 22);

  doc.setTextColor(15, 23, 42);
  cursorY = 42;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(product.title ?? 'Producto', left, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Cantidad solicitada: ${quantity}`, left, cursorY + 7);
  doc.text(`SKU: ${product.sku ?? '-'}`, left, cursorY + 13);
  doc.text(`Categoria: ${product.categoryLabel ?? product.category ?? '-'}`, left, cursorY + 19);
  doc.text(
    `Precio unitario: ${formatProductPrice(product)}`,
    left,
    cursorY + 25,
  );
  doc.text(`Norma: ${product.standard ?? '-'}`, left, cursorY + 31);
  doc.text(`Stock: ${product.stockLabel ?? '-'}`, left, cursorY + 37);

  cursorY += 50;

  doc.setDrawColor(219, 227, 238);
  doc.setLineWidth(0.3);
  doc.line(left, cursorY - 3, pageWidth - left, cursorY - 3);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 53, 110);
  doc.setFontSize(12);
  doc.text('Descripcion', left, cursorY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const descriptionLines = doc.splitTextToSize(product.description ?? '-', pageWidth - left * 2);
  doc.text(descriptionLines, left, cursorY + 9);

  cursorY += 12 + (descriptionLines.length * 5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 53, 110);
  doc.text('Resumen y especificaciones', left, cursorY + 2);

  autoTable(doc, {
    startY: cursorY + 6,
    head: [['Campo', 'Valor']],
    body: getSpecRows(product),
    theme: 'grid',
    margin: { left, right: left },
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 2.5,
      textColor: [51, 65, 85],
      lineColor: [219, 227, 238],
    },
    headStyles: {
      fillColor: [4, 53, 110],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold', textColor: [15, 23, 42] },
      1: { cellWidth: 'auto' },
    },
    didDrawPage: (data) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(left, pageHeight - 15, pageWidth - left, pageHeight - 15);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Documento generado para ${product.title ?? 'producto'}`, left, pageHeight - 9);
      doc.text(
        `Pagina ${doc.getNumberOfPages()}`,
        pageWidth - left,
        pageHeight - 9,
        { align: 'right' },
      );
      if (data.cursor?.y && data.cursor.y > pageHeight - 20) {
        doc.addPage();
      }
    },
  });

  doc.save(formatFileName(product.title));
};

export const submitQuote = async (customer, items) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  const payload = {
    accepted: customer.accepted ? 1 : 0,
    name: customer.name ?? '',
    business: customer.business ?? '',
    ruc: customer.ruc ?? '',
    email: customer.email ?? '',
    phone_prefix: customer.phonePrefix ?? '',
    phone: customer.phone ?? '',
    department: customer.department ?? '',
    province: customer.province ?? '',
    district: customer.district ?? '',
    ubigeo: customer.ubigeo ?? '',
    items: items.map((item) => ({
      title: item.title,
      sku: item.sku ?? '',
      image: item.image ?? '',
      detailUrl: item.detailUrl ?? '',
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: item.priceLabel ?? item.price ?? '',
      unitPrice: item.unitPrice ?? null,
      currency: item.currency ?? 'PEN',
    })),
  };

  const response = await fetch('/landing/quote', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = result?.errors
      ? Object.values(result.errors).flat()[0]
      : null;
    throw new Error(validationMessage || result?.message || 'No pudimos registrar tu cotización. Revisa los datos e inténtalo nuevamente.');
  }

  return result?.data ?? result ?? null;
};

const PRIMARY_RGB = [0, 73, 145];
const SECONDARY_RGB = [244, 227, 0];
const TEXT_RGB = [51, 65, 85];
const MUTED_RGB = [115, 120, 130];
const CARD_RGB = [241, 245, 249];
const INK_RGB = [15, 23, 42];

// Same typefaces as the web: Manrope (body) + Space Grotesk (titles).
const FONT_FILES = [
  { file: 'SpaceGrotesk-Regular.ttf', family: 'SpaceGrotesk', style: 'normal' },
  { file: 'SpaceGrotesk-Bold.ttf', family: 'SpaceGrotesk', style: 'bold' },
  { file: 'Manrope-Regular.ttf', family: 'Manrope', style: 'normal' },
  { file: 'Manrope-Bold.ttf', family: 'Manrope', style: 'bold' },
];

let quoteFontCache = null;

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return window.btoa(binary);
};

const loadQuoteFonts = async () => {
  if (quoteFontCache) return quoteFontCache;
  try {
    quoteFontCache = await Promise.all(FONT_FILES.map(async (entry) => {
      const response = await fetch(`/fonts/${entry.file}`);
      if (!response.ok) throw new Error('font');
      const buffer = await response.arrayBuffer();
      return { ...entry, base64: arrayBufferToBase64(buffer) };
    }));
  } catch {
    quoteFontCache = [];
  }
  return quoteFontCache;
};

const registerQuoteFonts = (doc, fonts) => {
  if (!fonts.length) return false;
  fonts.forEach((entry) => {
    doc.addFileToVFS(entry.file, entry.base64);
    doc.addFont(entry.file, entry.family, entry.style);
  });
  return true;
};

const loadLogoData = (src) => new Promise((resolve) => {
  const image = new Image();
  image.onload = () => {
    try {
      const w = image.naturalWidth || 192;
      const h = image.naturalHeight || 40;
      const scale = 5;
      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve({ data: canvas.toDataURL('image/png'), ratio: w / h });
    } catch {
      resolve(null);
    }
  };
  image.onerror = () => resolve(null);
  image.src = src;
});

const loadImageData = (src) => new Promise((resolve) => {
  if (!src) {
    resolve(null);
    return;
  }

  const image = new Image();
  image.crossOrigin = 'anonymous';

  image.onload = () => {
    try {
      const size = 200;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      const scale = Math.max(size / image.width, size / image.height);
      const drawW = image.width * scale;
      const drawH = image.height * scale;
      ctx.drawImage(image, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);

      resolve({ data: canvas.toDataURL('image/jpeg', 0.86), format: 'JPEG' });
    } catch {
      resolve(null);
    }
  };
  image.onerror = () => resolve(null);
  image.src = src;
});

const buildQuotePdf = async (customer, items, meta = {}) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const [fonts, logo, images] = await Promise.all([
    loadQuoteFonts(),
    loadLogoData('/assets/img/logo.svg'),
    Promise.all(items.map((item) => loadImageData(item.image))),
  ]);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const hasFonts = registerQuoteFonts(doc, fonts);
  const TITLE = hasFonts ? 'SpaceGrotesk' : 'helvetica';
  const BODY = hasFonts ? 'Manrope' : 'helvetica';
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const left = 16;
  const contentWidth = pageWidth - left * 2;

  // ---------------------------------------------------------------- Header (white)
  const code = meta.code ?? 'COTIZACIÓN';
  const dateLabel = meta.date
    ? new Date(meta.date).toLocaleDateString('es-PE')
    : new Date().toLocaleDateString('es-PE');

  // Quote chip (code + date) on the right — primary box pops on the white header
  const chipW = 56;
  const chipH = 18;
  const chipX = pageWidth - left - chipW;
  const chipY = 9;
  doc.setFillColor(...PRIMARY_RGB);
  doc.roundedRect(chipX, chipY, chipW, chipH, 2.5, 2.5, 'F');
  doc.setFont(BODY, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(190, 210, 235);
  doc.text('COTIZACIÓN', chipX + chipW / 2, chipY + 5, { align: 'center' });
  doc.setFont(TITLE, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(code, chipX + chipW / 2, chipY + 10.5, { align: 'center' });
  doc.setFont(BODY, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(214, 226, 240);
  doc.text(dateLabel, chipX + chipW / 2, chipY + 15, { align: 'center' });

  // Logo at its natural aspect ratio (clamped proportionally so it never squashes)
  if (logo) {
    const maxLogoW = chipX - left - 8;
    let logoH = 12;
    let logoW = logoH * logo.ratio;
    if (logoW > maxLogoW) {
      logoW = maxLogoW;
      logoH = logoW / logo.ratio;
    }
    doc.addImage(logo.data, 'PNG', left, chipY + (chipH - logoH) / 2, logoW, logoH);
  } else {
    doc.setFont(TITLE, 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...PRIMARY_RGB);
    doc.text('TUBOPLAST', left, chipY + 13);
  }

  // Brand accent separator under the header
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(left, 32, pageWidth - left, 32);
  doc.setFillColor(...SECONDARY_RGB);
  doc.rect(left, 33.4, 26, 1.6, 'F');

  // ----------------------------------------------------- Client data card
  let cursorY = 48;
  doc.setFillColor(...PRIMARY_RGB);
  doc.rect(left, cursorY - 3.4, 3, 3, 'F');
  doc.setFont(TITLE, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...PRIMARY_RGB);
  doc.text('Datos de la empresa / cliente', left + 5, cursorY);
  cursorY += 5;

  const phoneDisplay = [customer.phonePrefix, customer.phone].filter(Boolean).join(' ');
  const fieldGrid = [
    [['Nombre completo', customer.name], ['Razón social / Empresa', customer.business]],
    [['RUC', customer.ruc], ['Correo electrónico', customer.email]],
    [['Teléfono / WhatsApp', phoneDisplay], ['Departamento', customer.department]],
    [['Provincia', customer.province], ['Distrito', customer.district]],
  ];
  const padX = 7;
  const padY = 8;
  const rowH = 13;
  const cardH = padY * 2 + rowH * (fieldGrid.length - 1) + 9;
  doc.setFillColor(...CARD_RGB);
  doc.roundedRect(left, cursorY, contentWidth, cardH, 3, 3, 'F');

  const colW = (contentWidth - padX * 2) / 2;
  fieldGrid.forEach((row, rIndex) => {
    row.forEach(([label, value], cIndex) => {
      const x = left + padX + cIndex * colW;
      const y = cursorY + padY + rIndex * rowH;
      doc.setFont(BODY, 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED_RGB);
      doc.text(label.toUpperCase(), x, y);
      doc.setFont(BODY, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...INK_RGB);
      const text = (value && String(value).trim()) ? String(value) : '-';
      const clipped = doc.splitTextToSize(text, colW - 4)[0];
      doc.text(clipped, x, y + 5.5);
    });
  });

  cursorY += cardH + 12;

  // -------------------------------------------------------- Items section
  doc.setFillColor(...PRIMARY_RGB);
  doc.rect(left, cursorY - 3.4, 3, 3, 'F');
  doc.setFont(TITLE, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...PRIMARY_RGB);
  doc.text('Detalle de la cotización', left + 5, cursorY);
  cursorY += 5;

  const itemRows = items.map((item, index) => [
    String(index + 1),
    '',
    item.title,
    item.sku || '-',
    String(Math.max(1, Number(item.quantity) || 1)),
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [['N°', '', 'PRODUCTO', 'SKU', 'CANT.']],
    body: itemRows,
    theme: 'grid',
    margin: { left, right: left, bottom: 24 },
    styles: {
      font: BODY,
      fontSize: 9.5,
      cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      textColor: TEXT_RGB,
      lineColor: [222, 230, 240],
      lineWidth: 0.2,
      valign: 'middle',
      minCellHeight: 18,
    },
    headStyles: {
      fillColor: PRIMARY_RGB,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      minCellHeight: 9,
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 11, halign: 'center', textColor: MUTED_RGB },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 'auto', fontStyle: 'bold', textColor: INK_RGB },
      3: { cellWidth: 34, textColor: MUTED_RGB },
      4: { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: PRIMARY_RGB },
    },
    didDrawCell: (data) => {
      if (data.section !== 'body' || data.column.index !== 1) return;
      const image = images[data.row.index];
      const dim = 14;
      const x = data.cell.x + (data.cell.width - dim) / 2;
      const y = data.cell.y + (data.cell.height - dim) / 2;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(222, 230, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(x, y, dim, dim, 1.5, 1.5, image ? 'F' : 'FD');
      if (image) {
        doc.addImage(image.data, image.format, x + 0.6, y + 0.6, dim - 1.2, dim - 1.2);
      } else {
        doc.setTextColor(...MUTED_RGB);
        doc.setFontSize(11);
        doc.text('—', x + dim / 2, y + dim / 2 + 1.5, { align: 'center' });
      }
    },
    didDrawPage: () => {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(left, pageHeight - 18, pageWidth - left, pageHeight - 18);
      doc.setFont(BODY, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...MUTED_RGB);
      doc.text('La validez de este documento es de 15 días calendario.', left, pageHeight - 12);
      doc.text(
        `Página ${doc.getNumberOfPages()}`,
        pageWidth - left,
        pageHeight - 12,
        { align: 'right' },
      );
    },
  });

  // --------------------------------------------------------- Totals strip
  const totalUnits = items.reduce((total, item) => total + Math.max(1, Number(item.quantity) || 1), 0);
  let summaryY = (doc.lastAutoTable?.finalY ?? cursorY) + 8;
  if (summaryY > pageHeight - 34) {
    doc.addPage();
    summaryY = 24;
  }
  const summaryH = 16;
  doc.setFillColor(...PRIMARY_RGB);
  doc.roundedRect(left, summaryY, contentWidth, summaryH, 3, 3, 'F');
  doc.setFont(BODY, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(214, 226, 240);
  doc.text('RESUMEN', left + 7, summaryY + 6);
  doc.setFont(TITLE, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `${items.length} productos  ·  ${totalUnits} unidades`,
    left + 7,
    summaryY + 12,
  );
  doc.setFont(TITLE, 'bold');
  doc.setTextColor(...SECONDARY_RGB);
  doc.setFontSize(9);
  doc.text('TUBOPLAST S.A.', pageWidth - left - 7, summaryY + 9.5, { align: 'right' });

  return doc;
};

const quoteFileName = (customer, meta) => (
  formatFileName(`cotizacion-${meta.code || customer.business || customer.name || 'cotizacion'}`)
);

export const downloadQuotePdf = async (customer, items, meta = {}) => {
  const doc = await buildQuotePdf(customer, items, meta);
  if (!doc) return;
  doc.save(quoteFileName(customer, meta));
};

// Opens the quote inline in a new tab (blob with Content-Type application/pdf),
// so the browser renders it instead of downloading it. Pass a window opened
// synchronously on the click event to survive popup blockers.
export const openQuotePdf = async (customer, items, meta = {}, targetWindow = null) => {
  const doc = await buildQuotePdf(customer, items, meta);
  if (!doc) {
    targetWindow?.close();
    return;
  }

  const url = URL.createObjectURL(doc.output('blob'));
  if (targetWindow && !targetWindow.closed) {
    targetWindow.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener');
  }

  setTimeout(() => URL.revokeObjectURL(url), 60000);
};
