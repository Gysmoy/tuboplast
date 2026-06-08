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
      },
    ];
  }

  return writeQuoteItems(nextItems);
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
    `Precio unitario: ${product.unitPrice != null ? `S/ ${Number(product.unitPrice).toFixed(2)}` : product.price ?? '-'}`,
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
    `Precio unitario: ${product.unitPrice != null ? `S/ ${Number(product.unitPrice).toFixed(2)}` : product.price ?? '-'}`,
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
