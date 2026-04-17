window.TK168BrandLibrary = (() => {
  const items = [
    {
      key: 'rolls-royce',
      folder: 'rollsroyce',
      models: [
        { slug: 'cullinan', name: 'Cullinan', image: 'assets/images/vehicle-library/brands/rollsroyce/models/cullinan/hero.jpg' },
        { slug: 'ghost', name: 'Ghost', image: 'assets/images/vehicle-library/brands/rollsroyce/models/ghost/hero.jpg' },
        { slug: 'phantom', name: 'Phantom', image: 'assets/images/vehicle-library/brands/rollsroyce/models/phantom/hero.jpg' }
      ]
    },
    {
      key: 'bentley',
      folder: 'bentley',
      models: [
        { slug: 'bentayga', name: 'Bentayga', image: 'assets/images/vehicle-library/brands/bentley/models/bentayga/hero.jpg' },
        { slug: 'continental-gt', name: 'Continental GT', image: 'assets/images/vehicle-library/brands/bentley/models/continental-gt/hero.jpg' },
        { slug: 'flying-spur', name: 'Flying Spur', image: 'assets/images/vehicle-library/brands/bentley/models/flying-spur/hero.jpg' }
      ]
    },
    {
      key: 'mercedes',
      folder: 'mercedes',
      models: [
        { slug: 'c-class', name: 'C-Class', image: 'assets/images/vehicle-library/brands/mercedes/models/c-class/hero.jpg' },
        { slug: 'e-class', name: 'E-Class', image: 'assets/images/vehicle-library/brands/mercedes/models/e-class/hero.jpg' },
        { slug: 'gle', name: 'GLE', image: 'assets/images/vehicle-library/brands/mercedes/models/gle/hero.jpg' }
      ]
    },
    {
      key: 'bmw',
      folder: 'bmw',
      models: [
        { slug: '3-series', name: '3 Series', image: 'assets/images/vehicle-library/brands/bmw/models/3-series/hero.jpg' },
        { slug: '5-series', name: '5 Series', image: 'assets/images/vehicle-library/brands/bmw/models/5-series/hero.jpg' },
        { slug: 'x5', name: 'X5', image: 'assets/images/vehicle-library/brands/bmw/models/x5/hero.jpg' }
      ]
    },
    {
      key: 'porsche',
      folder: 'porsche',
      models: [
        { slug: '911', name: '911', image: 'assets/images/vehicle-library/brands/porsche/models/911/hero.jpg' },
        { slug: 'cayenne', name: 'Cayenne', image: 'assets/images/vehicle-library/brands/porsche/models/cayenne/hero.jpg' },
        { slug: 'macan', name: 'Macan', image: 'assets/images/vehicle-library/brands/porsche/models/macan/hero.jpg' }
      ]
    },
    {
      key: 'ferrari',
      folder: 'ferrari',
      models: [
        { slug: '488', name: '488', image: 'assets/images/vehicle-library/brands/ferrari/models/488/hero.jpg' },
        { slug: 'f8-tributo', name: 'F8 Tributo', image: 'assets/images/vehicle-library/brands/ferrari/models/f8-tributo/hero.jpg' },
        { slug: 'roma', name: 'Roma', image: 'assets/images/vehicle-library/brands/ferrari/models/roma/hero.jpg' }
      ]
    },
    {
      key: 'lamborghini',
      folder: 'lamborghini',
      models: [
        { slug: 'aventador', name: 'Aventador', image: 'assets/images/vehicle-library/brands/lamborghini/models/aventador/hero.jpg' },
        { slug: 'huracan', name: 'Huracan', image: 'assets/images/vehicle-library/brands/lamborghini/models/huracan/hero.jpg' },
        { slug: 'urus', name: 'Urus', image: 'assets/images/vehicle-library/brands/lamborghini/models/urus/hero.jpg' }
      ]
    },
    {
      key: 'audi',
      folder: 'audi',
      models: [
        { slug: 'a4', name: 'A4', image: 'assets/images/vehicle-library/brands/audi/models/a4/hero.jpg' },
        { slug: 'a6', name: 'A6', image: 'assets/images/vehicle-library/brands/audi/models/a6/hero.jpg' },
        { slug: 'q5', name: 'Q5', image: 'assets/images/vehicle-library/brands/audi/models/q5/hero.jpg' }
      ]
    },
    {
      key: 'lexus',
      folder: 'lexus',
      models: [
        { slug: 'ls', name: 'LS', image: 'assets/images/vehicle-library/brands/lexus/models/ls/hero.jpg' },
        { slug: 'nx', name: 'NX', image: 'assets/images/vehicle-library/brands/lexus/models/nx/hero.jpg' },
        { slug: 'rx', name: 'RX', image: 'assets/images/vehicle-library/brands/lexus/models/rx/hero.jpg' }
      ]
    },
    {
      key: 'landrover',
      folder: 'landrover',
      models: [
        { slug: 'defender', name: 'Defender', image: 'assets/images/vehicle-library/brands/landrover/models/defender/hero.jpg' },
        { slug: 'discovery', name: 'Discovery', image: 'assets/images/vehicle-library/brands/landrover/models/discovery/hero.jpg' },
        { slug: 'range-rover', name: 'Range Rover', image: 'assets/images/vehicle-library/brands/landrover/models/range-rover/hero.jpg' }
      ]
    },
    {
      key: 'maserati',
      folder: 'maserati',
      models: [
        { slug: 'ghibli', name: 'Ghibli', image: 'assets/images/vehicle-library/brands/maserati/models/ghibli/hero.jpg' },
        { slug: 'granturismo', name: 'GranTurismo', image: 'assets/images/vehicle-library/brands/maserati/models/granturismo/hero.jpg' },
        { slug: 'levante', name: 'Levante', image: 'assets/images/vehicle-library/brands/maserati/models/levante/hero.jpg' }
      ]
    },
    {
      key: 'astonmartin',
      folder: 'astonmartin',
      models: [
        { slug: 'db11', name: 'DB11', image: 'assets/images/vehicle-library/brands/astonmartin/models/db11/hero.jpg' },
        { slug: 'dbx', name: 'DBX', image: 'assets/images/vehicle-library/brands/astonmartin/models/dbx/hero.jpg' },
        { slug: 'vantage', name: 'Vantage', image: 'assets/images/vehicle-library/brands/astonmartin/models/vantage/hero.jpg' }
      ]
    },
    {
      key: 'mclaren',
      folder: 'mclaren',
      models: [
        { slug: '570s', name: '570S', image: 'assets/images/vehicle-library/brands/mclaren/models/570s/hero.jpg' },
        { slug: '720s', name: '720S', image: 'assets/images/vehicle-library/brands/mclaren/models/720s/hero.jpg' },
        { slug: 'artura', name: 'Artura', image: 'assets/images/vehicle-library/brands/mclaren/models/artura/hero.jpg' }
      ]
    },
    {
      key: 'jaguar',
      folder: 'jaguar',
      models: [
        { slug: 'f-pace', name: 'F-Pace', image: 'assets/images/vehicle-library/brands/jaguar/models/f-pace/hero.jpg' },
        { slug: 'f-type', name: 'F-Type', image: 'assets/images/vehicle-library/brands/jaguar/models/f-type/hero.jpg' },
        { slug: 'xe', name: 'XE', image: 'assets/images/vehicle-library/brands/jaguar/models/xe/hero.jpg' }
      ]
    },
    {
      key: 'cadillac',
      folder: 'cadillac',
      models: [
        { slug: 'ct5', name: 'CT5', image: 'assets/images/vehicle-library/brands/cadillac/models/ct5/hero.jpg' },
        { slug: 'escalade', name: 'Escalade', image: 'assets/images/vehicle-library/brands/cadillac/models/escalade/hero.jpg' },
        { slug: 'xt5', name: 'XT5', image: 'assets/images/vehicle-library/brands/cadillac/models/xt5/hero.jpg' }
      ]
    }
  ];

  const byKey = new Map(items.map((item) => [item.key, item]));

  function getByKey(key) {
    return byKey.get(String(key || '')) || null;
  }

  return {
    items,
    getByKey
  };
})();
