window.TK168InventoryContext = (() => {
  function createInventoryContext(search, vehicles) {
    const {
      parseInventoryFilters,
      getBrandByKey,
      filterVehicles,
      countActiveFilters,
      buildFilterSummary,
      buildInventoryUrl
    } = window.TK168_DATA;

    const filters = parseInventoryFilters(search);
    const currentBrand = filters.brand ? getBrandByKey(filters.brand) : null;
    const filteredVehicles = filterVehicles(vehicles, filters);
    const activeFilterCount = countActiveFilters(filters);

    return {
      filters,
      currentBrand,
      filteredVehicles,
      activeFilterCount,
      activeFilterSummary: buildFilterSummary(filters),
      hasActiveFilters: activeFilterCount > 0,
      canonicalInventoryUrl: buildInventoryUrl(filters)
    };
  }

  function createDetailContext(search) {
    const {
      getVehicleById,
      getRentalVehicleDetailById,
      resolveRentalDetailPageVehicle,
      getBrandByKey,
      vehicles,
      parseInventoryFilters,
      countActiveFilters,
      buildInventoryUrl,
      buildBrandUrl,
      buildDetailUrl
    } = window.TK168_DATA;

    const params = new URLSearchParams(search);
    const requestedVehicleId = (params.get('id') || '').trim();
    const isRentalDetail = params.get('from') === 'rental';

    const firstVehicle = () =>
      (Array.isArray(vehicles) && vehicles[0]) || null;

    let currentVehicle = null;
    if (isRentalDetail) {
      if (requestedVehicleId) {
        currentVehicle = resolveRentalDetailPageVehicle
          ? resolveRentalDetailPageVehicle(requestedVehicleId)
          : getRentalVehicleDetailById(requestedVehicleId);
      }
    } else {
      currentVehicle = requestedVehicleId ? getVehicleById(requestedVehicleId) : null;
      if (!currentVehicle) currentVehicle = firstVehicle();
    }

    const currentBrand = getBrandByKey(currentVehicle?.brandKey);
    const filters = parseInventoryFilters(search);
    const activeFilterCount = countActiveFilters(filters);
    const hasActiveFilters = activeFilterCount > 0;

    const filterPayload = { ...filters, ...(isRentalDetail ? { from: 'rental' } : {}) };

    return {
      requestedVehicleId: requestedVehicleId || (currentVehicle?.id ?? ''),
      currentVehicle,
      isRentalDetail,
      currentBrand,
      filters: filterPayload,
      activeFilterCount,
      hasActiveFilters,
      inventoryHref: hasActiveFilters
        ? buildInventoryUrl(filters)
        : buildBrandUrl(currentBrand?.key || currentVehicle?.brandKey || ''),
      canonicalDetailUrl: buildDetailUrl(currentVehicle?.id || '', filterPayload)
    };
  }

  return {
    createInventoryContext,
    createDetailContext
  };
})();
