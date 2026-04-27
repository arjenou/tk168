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

    // Resolution order when the query id can't be found:
    //   1. same id minus the `-catalog` suffix — catalog entries are
    //      placeholders synthesized from brand-library-data; if the API
    //      has a real vehicle under the same slug prefer that.
    //   2. the first real (non-catalog) vehicle of the same brand.
    //   3. a safe site-wide default.  Picking the first real vehicle
    //      avoids the old "everything lands on AUDI R8" bug when the
    //      site renders brand-library catalog cards whose ids don't
    //      exist in the admin-managed inventory.
    const SITE_DEFAULT_ID = 'audi-r8-spyder';
    const findRealBrandMatch = (brandKey) => {
      if (!brandKey || !Array.isArray(vehicles)) return null;
      return (
        vehicles.find(
          (v) => v.brandKey === brandKey && !String(v.id || '').endsWith('-catalog'),
        ) || null
      );
    };
    const firstRealVehicle = () =>
      (Array.isArray(vehicles) &&
        vehicles.find((v) => !String(v.id || '').endsWith('-catalog'))) ||
      getVehicleById(SITE_DEFAULT_ID) ||
      (Array.isArray(vehicles) ? vehicles[0] : null);

    let currentVehicle = null;
    if (isRentalDetail) {
      if (requestedVehicleId) {
        currentVehicle = getRentalVehicleDetailById(requestedVehicleId);
      }
    } else {
      currentVehicle = requestedVehicleId ? getVehicleById(requestedVehicleId) : null;
      if (!currentVehicle && requestedVehicleId && requestedVehicleId.endsWith('-catalog')) {
        const trimmed = requestedVehicleId.replace(/-catalog$/, '');
        currentVehicle = getVehicleById(trimmed) || null;
        if (!currentVehicle) {
          const parts = trimmed.split('-');
          if (parts.length > 0) currentVehicle = findRealBrandMatch(parts[0]);
        }
      }
      if (!currentVehicle) currentVehicle = firstRealVehicle();
      if (!currentVehicle) currentVehicle = getVehicleById(SITE_DEFAULT_ID);
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
