/**
 * 管理端「规格」下拉：选项文案一律为中文；存库值与 js/data.js 中
 * vehicleTypeOptions / vehicleFieldTranslations 对齐，
 * 车身类型选项与 js/data.js standardBodyStyleValues / vehicleFieldTranslations.bodyStyle 一致。
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

  const drive = [
    { value: "FWD", label: "FWD（前轮驱动）" },
    { value: "RWD", label: "RWD（后轮驱动）" },
    { value: "AWD", label: "AWD" },
    { value: "4WD", label: "4WD" },
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
    { value: "HEV（混动）", label: "HEV（混动）" },
    { value: "PHEV（插电混动）", label: "PHEV（插电混动）" },
    { value: "BEV（纯电动车）", label: "BEV（纯电动车）" },
    { value: "EREV（增程式电动车）", label: "EREV（增程式电动车）" },
    { value: "FCEV（氢燃料电池车）", label: "FCEV（氢燃料电池车）" }
  ];

  const trans = [
    { value: "自动挡", label: "自动挡" },
    { value: "手动挡", label: "手动挡" },
    { value: "CVT无级变速", label: "CVT 无级变速" },
    { value: "手自一体", label: "手自一体" },
    { value: "双离合", label: "双离合（DCT）" },
    { value: "电动车单速", label: "电动车单速" }
  ];

  /** 排量（存库原文，可含 Turbo / Hybrid 等后缀） */
  const displacement = [
    { value: "2.0L Turbo", label: "2.0L Turbo" },
    { value: "2.5L Hybrid", label: "2.5L Hybrid" },
    { value: "3.0L", label: "3.0L" },
    { value: "3.5L", label: "3.5L" },
    { value: "3.9L", label: "3.9L" },
    { value: "4.0L", label: "4.0L" },
    { value: "4.4L", label: "4.4L" },
    { value: "4.5L", label: "4.5L" },
    { value: "5.0L", label: "5.0L" },
    { value: "5.2L", label: "5.2L" },
    { value: "6.5L", label: "6.5L" }
  ];

  /** 气缸形式 / 缸数布局（V8、L4 等） */
  const cylinders = [
    { value: "L3", label: "L3" },
    { value: "L4", label: "L4" },
    { value: "V6", label: "V6" },
    { value: "V8", label: "V8" },
    { value: "V10", label: "V10" },
    { value: "V12", label: "V12" },
    { value: "W12", label: "W12" },
    { value: "H6", label: "水平对置 6 缸（H6）" },
    { value: "电动", label: "电动驱动单元" }
  ];

  /** 与 js/data.js standardBodyStyleValues 顺序、存库中文值一致 */
  const bodyStyle = [
    { value: "SUV", label: "SUV" },
    { value: "MPV", label: "MPV" },
    { value: "轿车", label: "轿车" },
    { value: "跑车", label: "跑车" },
    { value: "超跑", label: "超跑" },
    { value: "敞篷车", label: "敞篷车" },
    { value: "旅行车", label: "旅行车" },
    { value: "双门轿跑", label: "双门轿跑" },
    { value: "皮卡", label: "皮卡" },
    { value: "轻自动车", label: "轻自动车" },
    { value: "商务车 / 面包车", label: "商务车 / 面包车" },
    { value: "越野车", label: "越野车" }
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
    displacement,
    cylinders,
    bodyColor: vehicleColorPalette,
    interiorColor: vehicleColorPalette
  };
})();
