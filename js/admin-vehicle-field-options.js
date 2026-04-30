/**
 * 管理端「规格」下拉：选项文案一律为中文；存库值与 js/data.js 中
 * vehicleTypeOptions / bodyTypeSearchOptions / vehicleFieldTranslations 对齐，
 * 车身颜色与内饰颜色共用 vehicleColorPalette（中文存库）。
 * 前台 i18n 由 TK168_DATA.getVehicleTypeLabel / getVehicleFieldLabel 负责。
 */
(function () {
  const vehicleType = [
    { value: "高性能SUV", label: "高性能SUV" },
    { value: "豪华SUV", label: "豪华SUV" },
    { value: "越野SUV", label: "越野SUV" },
    { value: "轿跑SUV", label: "轿跑SUV" },
    { value: "行政轿车", label: "行政轿车" },
    { value: "豪华轿车", label: "豪华轿车" },
    { value: "高性能轿车", label: "高性能轿车" },
    { value: "双门轿跑", label: "双门轿跑" },
    { value: "四门轿跑", label: "四门轿跑" },
    { value: "GT跑车", label: "GT跑车" },
    { value: "中置跑车", label: "中置跑车" },
    { value: "敞篷跑车", label: "敞篷跑车" },
    { value: "V12超跑", label: "V12超跑" },
    { value: "混动超跑", label: "混动超跑" },
    { value: "纯电性能车", label: "纯电性能车" },
    { value: "猎装车", label: "猎装车" },
    { value: "旅行车", label: "旅行车" },
    { value: "MPV", label: "MPV" },
    { value: "皮卡", label: "皮卡" }
  ];

  /** 与首页「车身类型」筛选 bodyTypeSearchOptions 一致，存库为英文 slug */
  const bodyStyle = [
    { value: "kei", label: "轻型车" },
    { value: "compact", label: "紧凑型车" },
    { value: "mpv", label: "MPV" },
    { value: "wagon", label: "旅行车" },
    { value: "suv", label: "SUV" },
    { value: "sedan", label: "轿车" },
    { value: "camper", label: "露营房车" },
    { value: "coupe", label: "轿跑" },
    { value: "hybrid", label: "混动" },
    { value: "hatchback", label: "掀背车" },
    { value: "convertible", label: "敞篷" },
    { value: "pickup", label: "皮卡" },
    { value: "welfare", label: "福祉车" },
    { value: "commercial-van", label: "商用面包车" },
    { value: "truck", label: "卡车" },
    { value: "other", label: "其他" }
  ];

  const drive = [
    { value: "前轮驱动", label: "前轮驱动（前驱）" },
    { value: "后轮驱动", label: "后轮驱动（后驱）" },
    { value: "四轮驱动", label: "四轮驱动（四驱）" },
    { value: "适时四驱", label: "适时四驱" },
    { value: "全时四驱", label: "全时四驱" },
    { value: "电动四驱", label: "电动四驱" }
  ];

  const seats = [
    { value: "2 座", label: "2 座" },
    { value: "4 座", label: "4 座" },
    { value: "5 座", label: "5 座" },
    { value: "6 座", label: "6 座" },
    { value: "7 座", label: "7 座" },
    { value: "8 座及以上", label: "8 座及以上" }
  ];

  const fuel = [
    { value: "汽油", label: "汽油" },
    { value: "柴油", label: "柴油" },
    { value: "油电混动", label: "油电混动" },
    { value: "插电混动", label: "插电混动" },
    { value: "纯电动", label: "纯电动" },
    { value: "增程式", label: "增程式" },
    { value: "Hybrid", label: "混动（Hybrid）" },
    { value: "EV", label: "EV（兼容旧数据）" }
  ];

  const trans = [
    { value: "自动挡", label: "自动挡" },
    { value: "手动挡", label: "手动挡" },
    { value: "CVT无级变速", label: "CVT 无级变速" },
    { value: "手自一体", label: "手自一体" },
    { value: "双离合", label: "双离合（DCT）" },
    { value: "电动车单速", label: "电动车单速" }
  ];

  /** 与 js/data.js vehicleFieldTranslations.bodyColor / interiorColor 的键一致；存库为中文，前台自动译日/英 */
  const vehicleColorPalette = [
    { value: "白色", label: "白色" },
    { value: "珍珠白", label: "珍珠白" },
    { value: "黑色", label: "黑色" },
    { value: "珍珠黑", label: "珍珠黑" },
    { value: "银色", label: "银色" },
    { value: "灰色", label: "灰色" },
    { value: "蓝色", label: "蓝色" },
    { value: "深蓝色", label: "深蓝色" },
    { value: "红色", label: "红色" },
    { value: "酒红色", label: "酒红色" },
    { value: "粉色", label: "粉色" },
    { value: "黄色", label: "黄色" },
    { value: "金色", label: "金色" },
    { value: "橙色", label: "橙色" },
    { value: "绿色", label: "绿色" },
    { value: "棕色", label: "棕色" },
    { value: "米色", label: "米色" },
    { value: "紫色", label: "紫色" }
  ];

  window.TK168AdminVehicleFieldOptions = {
    vehicleType,
    bodyStyle,
    drive,
    seats,
    fuel,
    trans,
    bodyColor: vehicleColorPalette,
    interiorColor: vehicleColorPalette
  };
})();
