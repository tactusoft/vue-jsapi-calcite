export const categories = [{
    id: 1,
    name: 'SICON',
    icon: 'conference-room',
    description: 'Buscar por propuestas, etc...',
    subMenus: [{
        title: "Búsqueda por Propuestas",
        description: "SICON",
        route: "/sicon",
    }]
},
{
    id: 2,
    name: 'SISBIC',
    icon: 'analysis',
    description: 'Buscar por CHIP, etc...',
    subMenus: [{
        title: "Búsqueda por CHIP",
        description: "IDPC",
        route: "/sisbic",
      },]
},
{
    id: 3,
    name: 'DEEP',
    icon: 'layer-graphics',
    description: 'Buscar por Localidad y Distrito, etc...',
    subMenus: [{
        title: "Búsqueda por Localidad y Distrito",
        description: "DEEP",
        route: "/deep",
      },{
        title: "Búsqueda de Bibliotecas por Distritos",
        description: "DEEP",
        route: "/deepbiblio",
      },]
},
{
    id: 4,
    name: 'Bibliotecas',
    icon: 'book',
    description: 'Buscar por Posición Actual, etc...',
    subMenus: [{
        title: "Buscar Posición Actual",
        description: "BIBLIO",
        route: "/biblio",
      },]
}
]

