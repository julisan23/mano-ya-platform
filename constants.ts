import { Professional, TradeType } from './types';

export const LOCATIONS_BA = [
  "Palermo, CABA",
  "Recoleta, CABA",
  "Belgrano, CABA",
  "Caballito, CABA",
  "Almagro, CABA",
  "Villa Urquiza, CABA",
  "San Isidro, Zona Norte",
  "Vicente López, Zona Norte",
  "Olivos, Zona Norte",
  "Tigre, Zona Norte",
  "Avellaneda, Zona Sur",
  "Lanús, Zona Sur",
  "Quilmes, Zona Sur",
  "Ramos Mejía, Zona Oeste",
  "Morón, Zona Oeste"
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Carlos Ruiz',
    trade: TradeType.PLOMERIA,
    rating: 4.8,
    reviewCount: 124,
    verified: true,
    location: 'Palermo, CABA',
    hourlyRateArg: 15000,
    imageUrl: 'https://picsum.photos/200/200?random=1',
    description: 'Especialista en destapaciones y filtraciones urgentes. 20 años de experiencia.',
    phone: '+54 9 11 1234 5678',
    email: 'carlos.plomeria@example.com',
    reviews: [{ author: 'Ana M.', rating: 5, comment: 'Llegó en 30 minutos y solucionó todo.' }],
    portfolio: [
      {
        id: 'p1',
        title: 'Renovación de Baño',
        imageUrl: 'https://picsum.photos/400/300?random=101',
        description: 'Cambio completo de cañerías y grifería en departamento antiguo.'
      },
      {
        id: 'p2',
        title: 'Instalación Termotanque',
        imageUrl: 'https://picsum.photos/400/300?random=102',
        description: 'Instalación de alta recuperación en edificio.'
      }
    ]
  },
  {
    id: '2',
    name: 'Miguel Ángel Torres',
    trade: TradeType.GASISTA,
    rating: 4.9,
    reviewCount: 89,
    verified: true,
    location: 'Belgrano, CABA',
    imageUrl: 'https://picsum.photos/200/200?random=2',
    description: 'Gasista Matriculado de primera categoría. Instalaciones y reparaciones.',
    phone: '+54 9 11 8765 4321',
    email: 'miguel.gas@example.com',
    reviews: [],
    portfolio: [
      {
        id: 'p3',
        title: 'Prueba de Hermeticidad',
        imageUrl: 'https://picsum.photos/400/300?random=103',
        description: 'Detección y reparación de fuga en cañería principal.'
      }
    ]
  },
  {
    id: '3',
    name: 'Electricidad El Rayo',
    trade: TradeType.ELECTRICISTA,
    rating: 4.5,
    reviewCount: 210,
    verified: true,
    location: 'San Isidro, Zona Norte',
    imageUrl: 'https://picsum.photos/200/200?random=3',
    description: 'Urgencias 24hs. Tableros, cableados y cortocircuitos.',
    phone: '+54 9 11 5555 0000',
    email: 'contacto@elrayo.com',
    reviews: [],
    portfolio: [
      {
        id: 'p4',
        title: 'Tablero Seccional',
        imageUrl: 'https://picsum.photos/400/300?random=104',
        description: 'Recableado y normalización de tablero eléctrico domiciliario.'
      },
      {
        id: 'p5',
        title: 'Iluminación LED',
        imageUrl: 'https://picsum.photos/400/300?random=105',
        description: 'Instalación de luminarias en local comercial.'
      },
      {
        id: 'p6',
        title: 'Puesta a Tierra',
        imageUrl: 'https://picsum.photos/400/300?random=106',
        description: 'Instalación de jabalina y certificación.'
      }
    ]
  },
  {
    id: '4',
    name: 'Hermanos López',
    trade: TradeType.TECHISTA,
    rating: 4.7,
    reviewCount: 45,
    verified: true,
    location: 'Lanús, Zona Sur',
    imageUrl: 'https://picsum.photos/200/200?random=4',
    description: 'Impermeabilizaciones y reparación de tejas. Garantía escrita.',
    phone: '+54 9 11 2222 3333',
    email: 'techoslopez@example.com',
    reviews: [],
    portfolio: []
  },
  {
    id: '5',
    name: 'Jardines Verdes',
    trade: TradeType.JARDINERO,
    rating: 4.9,
    reviewCount: 15,
    verified: false,
    location: 'Tigre, Zona Norte',
    imageUrl: 'https://picsum.photos/200/200?random=5',
    description: 'Diseño de paisajes, poda y mantenimiento general.',
    phone: '+54 9 11 9999 8888',
    email: 'jardin@verdes.com',
    reviews: [],
    portfolio: [
      {
        id: 'p7',
        title: 'Diseño Paisajístico',
        imageUrl: 'https://picsum.photos/400/300?random=107',
        description: 'Renovación completa de jardín trasero en barrio cerrado.'
      }
    ]
  },
    {
    id: '6',
    name: 'Mario Gomez',
    trade: TradeType.PLOMERIA,
    rating: 4.2,
    reviewCount: 30,
    verified: true,
    location: 'Caballito, CABA',
    hourlyRateArg: 12000,
    imageUrl: 'https://picsum.photos/200/200?random=6',
    description: 'Arreglos rápidos de canillas, inodoros y bidet.',
    phone: '+54 9 11 1111 2222',
    email: 'mario.gomez@example.com',
    reviews: [],
    portfolio: []
  },
  {
    id: '7',
    name: 'Pinturas Pro',
    trade: TradeType.PINTOR,
    rating: 4.6,
    reviewCount: 56,
    verified: true,
    location: 'Vicente López, Zona Norte',
    imageUrl: 'https://picsum.photos/200/200?random=7',
    description: 'Pintura de obra, interiores y exteriores. Prolijidad absoluta.',
    phone: '+54 9 11 4444 5555',
    email: 'info@pinturaspro.com',
    reviews: [],
    portfolio: [
       {
        id: 'p8',
        title: 'Pintura Interior',
        imageUrl: 'https://picsum.photos/400/300?random=108',
        description: 'Enduido y pintura látex lavable en living comedor.'
      }
    ]
  },
  {
    id: '8',
    name: 'Muebles a Medida',
    trade: TradeType.CARPINTERO,
    rating: 5.0,
    reviewCount: 12,
    verified: true,
    location: 'Ramos Mejía, Zona Oeste',
    imageUrl: 'https://picsum.photos/200/200?random=8',
    description: 'Restauración y fabricación de muebles. Carpintería en general.',
    phone: '+54 9 11 7777 6666',
    email: 'taller@madera.com',
    reviews: [],
    portfolio: [
      {
        id: 'p9',
        title: 'Biblioteca a Medida',
        imageUrl: 'https://picsum.photos/400/300?random=109',
        description: 'Biblioteca de petiribí de piso a techo.'
      },
      {
        id: 'p10',
        title: 'Bajo Mesada',
        imageUrl: 'https://picsum.photos/400/300?random=110',
        description: 'Mueble de cocina en melamina blanca.'
      }
    ]
  },
   {
    id: '9',
    name: 'Piletero Clean',
    trade: TradeType.PILETERO,
    rating: 4.8,
    reviewCount: 40,
    verified: true,
    location: 'Pilar, Zona Norte',
    imageUrl: 'https://picsum.photos/200/200?random=9',
    description: 'Mantenimiento integral de piscinas. Control de pH y cloro.',
    phone: '+54 9 11 3333 4444',
    email: 'clean@piletero.com',
    reviews: [],
    portfolio: []
  },
  {
    id: '10',
    name: 'Estudio Santarsiero',
    trade: TradeType.ARQUITECTO,
    rating: 5.0,
    reviewCount: 8,
    verified: true,
    location: 'Recoleta, CABA',
    imageUrl: 'https://picsum.photos/200/200?random=20',
    description: 'Proyectos de obra nueva, dirección de obra y renders fotorrealistas. Especialistas en reformas integrales.',
    phone: '+54 9 11 5555 9999',
    email: 'arq@santarsiero.com',
    reviews: [
      { author: 'Marcela V.', rating: 5, comment: 'El render quedó igual a la realidad. Excelente reforma.' }
    ],
    portfolio: [
       {
        id: 'p20',
        title: 'Casa en Nordelta',
        imageUrl: 'https://picsum.photos/400/300?random=120',
        description: 'Proyecto y dirección de vivienda unifamiliar. 250m2.'
      },
      {
        id: 'p21',
        title: 'Reforma PH Palermo',
        imageUrl: 'https://picsum.photos/400/300?random=121',
        description: 'Reciclaje total de PH antiguo manteniendo fachada original.'
      },
      {
        id: 'p22',
        title: 'Render 3D',
        imageUrl: 'https://picsum.photos/400/300?random=122',
        description: 'Visualización fotorrealista para desarrollo inmobiliario.'
      }
    ]
  }
];