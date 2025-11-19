function FilterButtons({ currentFilter, onFilterChange}) {
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Read', value: 'read' },
    { label: 'Favorites', value: 'favorites' },
    { label: 'trash', value: 'trash' }
 
  ];

  return (
    <div className="flex gap-3">
      <span className="text-lg font-medium text-gray-700">Filter By:</span>
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
