import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import HtmlContent from './Utils/HtmlContent.jsx';
import CreateReactScript from './Utils/CreateReactScript';

const slugify = (value, index) => {
  const base = String(value || 'post')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!base) {
    return `post-${index + 1}`;
  }

  return base.endsWith(`-${index + 1}`) ? base : `${base}-${index + 1}`;
};

const detailTemplates = [
  {
    eyebrow: 'Innovacion tecnica',
    author: 'Ing. Roberto Sanchez',
    role: 'Director Tecnico',
    published: '15 de Octubre, 2026',
    readTime: '12 min de lectura',
    lead:
      'La industria de conduccion hidrica en el Peru esta entrando en una nueva etapa, marcada por eficiencia, control de calidad y soluciones de mayor vida util.',
    sections: [
      {
        title: 'Nuevos Estandares de Manufactura',
        paragraphs: [
          'La implementacion de tecnologias de extrusión y control dimensional mas precisas permite alcanzar tuberias mas consistentes, con mejor respuesta mecanica y mejor comportamiento frente a la presion interna.',
          'En Tuboplast, estos avances se traducen en piezas pensadas para obras exigentes, donde la confiabilidad operativa no puede dejar espacio a la improvisacion.',
        ],
      },
      {
        title: 'Sustentabilidad y Economia Circular',
        paragraphs: [
          'El desarrollo industrial moderno ya no solo busca rendimiento. Tambien exige eficiencia energetica, menor desperdicio de material y procesos responsables con el entorno.',
          'La circularidad aplicada al PVC permite avanzar hacia sistemas mas sostenibles sin comprometer la integridad estructural del producto final.',
        ],
      },
      {
        title: 'Contribucion a la Infraestructura Nacional',
        paragraphs: [
          'Desde proyectos de saneamiento hasta redes de distribucion industrial, la precision del material influye directamente en la continuidad del servicio y en el costo total de operacion.',
          'Por eso, cada mejora de manufactura impacta de forma real en el desarrollo de la infraestructura peruana y en la durabilidad de las obras ejecutadas.',
        ],
      },
    ],
    highlight:
      'Una tuberia bien fabricada no solo transporta agua: sostiene la confiabilidad de toda una red de infraestructura.',
  },
  {
    eyebrow: 'Capacitacion tecnica',
    author: 'Equipo de Soporte',
    role: 'Asesoria de Aplicacion',
    published: '03 de Septiembre, 2026',
    readTime: '9 min de lectura',
    lead:
      'Instalar correctamente es tan importante como fabricar bien. Una union bien ejecutada puede marcar la diferencia entre una obra segura y un problema futuro.',
    sections: [
      {
        title: 'Preparacion y Corte',
        paragraphs: [
          'La limpieza del corte, la calibracion de la herramienta y la verificacion de tolerancias son pasos basicos que evitan fugas y desalineaciones.',
          'Un proceso cuidadoso mejora la continuidad del flujo y reduce tiempos de mantenimiento posterior.',
        ],
      },
      {
        title: 'Pegado y Tiempos de Curado',
        paragraphs: [
          'Respetar los tiempos de secado y curado no es un detalle menor. Es una condicion necesaria para asegurar una union resistente y durable.',
          'La capacitacion tecnica debe reforzar estas practicas en cada obra para estandarizar la calidad de instalacion.',
        ],
      },
      {
        title: 'Control en Obra',
        paragraphs: [
          'Supervisar cada union, cada accesorio y cada tramo instalado ayuda a prevenir retrabajos y garantiza que el sistema opere con el comportamiento esperado.',
          'La supervisión tecnica es una inversion que protege el proyecto a largo plazo.',
        ],
      },
    ],
    highlight:
      'La instalacion correcta no es un paso final: es parte del rendimiento total del sistema.',
  },
  {
    eyebrow: 'Industria',
    author: 'Area Comercial',
    role: 'Mercado y Proyectos',
    published: '18 de Julio, 2026',
    readTime: '7 min de lectura',
    lead:
      'Los retos de la infraestructura hidrica exigen materiales consistentes, soporte tecnico cercano y capacidad de respuesta en proyectos de gran escala.',
    sections: [
      {
        title: 'Demanda y Cobertura Nacional',
        paragraphs: [
          'Las necesidades del mercado peruano requieren proveedores capaces de atender proyectos en distintas regiones con tiempos de entrega confiables.',
          'La cobertura nacional es un factor decisivo para la continuidad de obras de infraestructura y saneamiento.',
        ],
      },
      {
        title: 'Respaldo Tecnico para Proyectos',
        paragraphs: [
          'La asesoria tecnica permite escoger la solucion adecuada segun el tipo de obra, el caudal requerido y las condiciones de instalacion.',
          'Ese acompanamiento reduce riesgos y mejora la eficiencia en la toma de decisiones del cliente.',
        ],
      },
      {
        title: 'Una Industria en Evolucion',
        paragraphs: [
          'La modernizacion del sector construccion en 2026 exige empresas que no solo vendan producto, sino que aporten conocimiento y continuidad operativa.',
          'La industria avanza cuando la calidad del material acompaña a la calidad del proyecto.',
        ],
      },
    ],
    highlight:
      'El crecimiento de la infraestructura peruana depende tanto del producto como del soporte que lo acompana.',
  },
];

const buildFallbackDetail = (post) => ({
  eyebrow: post.category || 'Blog',
  author: 'Equipo Tuboplast',
  role: 'Contenido editorial',
  published: 'Actualizado recientemente',
  readTime: '6 min de lectura',
  lead: post.description || 'Contenido editorial de Tuboplast.',
  sections: [
    {
      title: post.title || 'Articulo',
      paragraphs: [
        post.description || 'Este articulo comparte informacion tecnica y contexto util para proyectos de infraestructura y conduccion hidrica.',
        'Mantendremos este contenido alineado al estilo editorial del blog para ofrecer una lectura clara, cercana y util para el sector.',
      ],
    },
  ],
  highlight: 'Cada articulo del blog esta pensado para aportar criterio tecnico y contexto de valor.',
});

const contentWrapperClasses =
  'space-y-6 text-[18px] leading-[1.9] text-slate-600 [&_h2]:font-title [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-primary [&_h3]:font-title [&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:text-primary [&_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2';

const parseCustomContent = (content = '') => {
  const normalized = String(content)
    .replace(/\r\n/g, '\n')
    .replace(/([^\n])\s+(#{1,3})(?=\S)/g, '$1\n$2');
  const lines = normalized.split('\n');
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    const headingMatch = line.match(/^(#{1,3})\s*(.+)$/);
    if (headingMatch) {
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      return;
    }

    if (/^-\s+/.test(line)) {
      flushList();
      listItems.push(line.replace(/^-\s+/g, ''));
      return;
    }

    flushList();
    blocks.push({ type: 'paragraph', text: line });
  });

  flushList();
  return blocks;
};

const renderInlineMarkup = (text = '') => {
  const nodes = [];
  let remaining = String(text);
  let index = 0;

  while (remaining.length) {
    const match = remaining.match(/(\*\*[^*]+\*\*|\*[^*]+\*)/);

    if (!match || match.index == null) {
      nodes.push(remaining);
      break;
    }

    if (match.index > 0) {
      nodes.push(remaining.slice(0, match.index));
    }

    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={`strong-${index++}`}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={`em-${index++}`}>{token.slice(1, -1)}</em>);
    }

    remaining = remaining.slice(match.index + token.length);
  }

  return nodes;
};

const renderCustomContent = (content) =>
  parseCustomContent(content).map((block, index) => {
    if (block.type === 'heading') {
      const HeadingTag = block.level >= 3 ? 'h3' : 'h2';
      return (
        <HeadingTag key={`heading-${index}`} className={block.level >= 3 ? 'mt-4' : ''}>
          {renderInlineMarkup(block.text)}
        </HeadingTag>
      );
    }

    if (block.type === 'list') {
      return (
        <ul key={`list-${index}`} className="space-y-2">
          {block.items.map((item, itemIndex) => (
            <li key={`list-${index}-${itemIndex}`}>{renderInlineMarkup(item)}</li>
          ))}
        </ul>
      );
    }

    return <p key={`paragraph-${index}`}>{renderInlineMarkup(block.text)}</p>;
  });

const NewsletterCard = ({ newsletter = {} }) => (
  <aside className="overflow-hidden rounded-2xl bg-primary text-white shadow-[0_10px_30px_rgba(0,59,122,0.22)]">
    <div className="bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),linear-gradient(135deg,rgba(0,59,122,1),rgba(0,78,155,1))] px-5 py-6">
      {newsletter.eyebrow ? <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">{newsletter.eyebrow}</p> : null}
      <h3 className="max-w-[14ch] font-title text-2xl leading-tight">
        {newsletter.title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-white/80">
        {newsletter.description}
      </p>

      <div className="mt-6 space-y-3">
        <input
          className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-sm outline-none placeholder:text-white/55"
          placeholder={newsletter.placeholder}
          type="email"
        />
        <button
          type="button"
          className="w-full rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-primary transition hover:bg-[#f0d200]"
        >
          {newsletter.buttonLabel}
        </button>
      </div>
    </div>
  </aside>
);

const BlogPostScreen = ({ blog = {}, postSlug = '' }) => {
  const posts = Array.isArray(blog.posts) ? blog.posts : [];
  const selectedIndex = posts.findIndex((item, index) => (item.slug || slugify(item.title, index)) === postSlug);
  const selectedPost = posts[selectedIndex >= 0 ? selectedIndex : 0] || {};
  const template = detailTemplates[selectedIndex] || buildFallbackDetail(selectedPost);
  const heroImage =
    selectedPost.image_url ||
    selectedPost.image_fallback ||
    selectedPost.image ||
    blog.hero_image_url ||
    '/assets/img/landing/bg-main.png';
  const customContent = String(selectedPost.content_html || '');
  const hasCustomContent = customContent.trim().length > 0;
  const looksLikeHtml = /<\s*(p|br|div|h[1-6]|ul|ol|li|strong|em|blockquote|span|a)[\s>]/i.test(customContent);
  const eyebrow = selectedPost.eyebrow || template.eyebrow || 'Blog';
  const author = selectedPost.author || template.author || 'Equipo Tuboplast';
  const role = selectedPost.role || template.role || 'Contenido editorial';
  const published = selectedPost.published || template.published || 'Actualizado recientemente';
  const readTime = selectedPost.read_time || template.readTime || '6 min de lectura';
  const lead = selectedPost.lead || template.lead || selectedPost.description || '';
  const highlightLabel = selectedPost.highlight_label || 'Nota Tecnica';
  const highlightText = selectedPost.highlight || template.highlight || '';
  const newsletter = {
    eyebrow: blog.newsletter_eyebrow || 'Newsletter',
    title: blog.newsletter_title || 'SE EL PRIMERO EN SABER',
    description: blog.newsletter_description || 'Tips de instalación, nuevos productos y actualizaciones exclusivas para profesionales.',
    placeholder: blog.newsletter_placeholder || 'Correo electronico',
    buttonLabel: blog.newsletter_button_label || 'Suscribirme ahora',
  };

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-site px-4 pt-12 sm:pt-16 lg:pt-20">
        <div className="max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
            {eyebrow}
          </p>

          <h1 className="mt-4 max-w-4xl font-title text-3xl font-medium leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
            {selectedPost.title || 'Articulo del blog'}
          </h1>

          <div className="mt-10 flex flex-wrap items-start gap-x-12 gap-y-4 border-b border-slate-200 pb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                {author}
              </p>
              <p className="text-sm text-muted">{role}</p>
            </div>
            <div className="min-w-[120px] border-l border-slate-200 pl-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Publicado
              </p>
              <p className="text-sm text-muted">{published}</p>
            </div>
            <div className="min-w-[120px] border-l border-slate-200 pl-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Lectura
              </p>
              <p className="text-sm text-muted">{readTime}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-4 py-10 sm:py-12 lg:py-14">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-[28px] bg-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <img
              src={heroImage}
              alt={selectedPost.title || 'Blog'}
              className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[470px]"
            />
          </div>

          <article className="min-w-0">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div className="space-y-8">
                <div className={contentWrapperClasses}>
                  {lead ? <p>{lead}</p> : null}

                  {hasCustomContent ? (
                    looksLikeHtml ? <HtmlContent html={customContent} /> : renderCustomContent(customContent)
                  ) : (
                    <>
                      {template.sections.map((section) => (
                        <section key={section.title} className="space-y-3">
                          <h2>
                            {section.title}
                          </h2>
                          <div className="space-y-4">
                            {section.paragraphs.map((paragraph, index) => (
                              <p key={`${section.title}-${index}`}>{paragraph}</p>
                            ))}
                          </div>
                        </section>
                      ))}
                    </>
                  )}

                  {highlightText ? (
                    <div className="rounded-[20px] border-l-4 border-secondary bg-slate-50 px-6 py-5 shadow-sm">
                      <h3>{highlightLabel}</h3>
                      <p className="mt-3 text-slate-600">{highlightText}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <NewsletterCard newsletter={newsletter} />
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Base title={properties.post?.title || 'Blog'}>
      <BlogPostScreen {...properties} />
    </Base>,
  );
});
