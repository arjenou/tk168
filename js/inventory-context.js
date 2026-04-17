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
      getBrandByKey,
      parseInventoryFilters,
      countActiveFilters,
      buildInventoryUrl,
      buildBrandUrl,
      buildDetailUrl
    } = window.TK168_DATA;

    const params = new URLSearchParams(search);
    const requestedVehicleId = params.get('id') || 'audi-r8-spyder';
    const currentVehicle = getVehicleById(requestedVehicleId) || getVehicleById('audi-r8-spyder');
    const currentBrand = getBrandByKey(currentVehicle.brandKey);
    const filters = parseInventoryFilters(search);
    const activeFilterCount = countActiveFilters(filters);
    const hasActiveFilters = activeFilterCount > 0;

    return {
      requestedVehicleId,
      currentVehicle,
      currentBrand,
      filters,
      activeFilterCount,
      hasActiveFilters,
      inventoryHref: hasActiveFilters ? buildInventoryUrl(filters) : buildBrandUrl(currentBrand.key),
      canonicalDetailUrl: buildDetailUrl(currentVehicle.id, filters)
    };
  }

  return {
    createInventoryContext,
    createDetailContext
  };
})();
