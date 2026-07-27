// import {type CategoryDetailsTypes} from 'utils/TypeConfig';

// export const renderCategoryOptions = (
//   data: CategoryDetailsTypes,
//   initialValues: CategoryDetailsTypes[] = [], // set a default value
//   categoryName: string[] = [],
//   editCategory: string = '',
// ): string => {
//   const parentData: CategoryDetailsTypes | undefined = initialValues?.find(
//     innerData => innerData?.id === data?.parent_id,
//   );
//   const categoryArray = [...categoryName, data.name];

//   // If the current category matches the editCategory
//   if (editCategory === data.name) {
//     // If the matched category is at the top level (root), return nothing
//     if (data.id === data.parent_id) {
//       return ''; // Do not render anything for top-level match
//     }
//     // Otherwise, return parent categories (excluding the matched category)
//     return categoryName.join(' > ');
//   }

//   if (data.id === data.parent_id) {
//     const categoryOption = data.name;
//     return categoryOption;
//   }

//   // console.log('🚀 ~ parentData:', parentData);
//   if (parentData != null) {
//     return renderCategoryOptions(
//       parentData,
//       initialValues,
//       categoryArray,
//       editCategory,
//     );
//   } else {
//     // console.log('🚀 ~ parentData: child', categoryArray);
//     const categoryOption = categoryArray.reverse().join(' > ');
//     return categoryOption;
//   }
// };

import {type CategoryDetailsTypes} from 'utils/TypeConfig';

export const renderCategoryOptions = (
  data: CategoryDetailsTypes,
  initialValues: CategoryDetailsTypes[] = [],
  categoryName: string[] = [],
  editCategory: string = '',
  visited = new Set<number>(), // Track visited category IDs
): string => {
  // Prevent infinite loops
  if (visited.has(data.id)) {
    console.warn(`Detected circular reference in category ID: ${data.id}`);
    return categoryName.reverse().join(' > '); // Return the current hierarchy
  }
  visited.add(data.id); // Mark category as visited

  const parentData: CategoryDetailsTypes | undefined = initialValues?.find(
    innerData => innerData?.id === data?.parent_id,
  );

  const categoryArray = [...categoryName, data.name];

  // Stop condition: If editing and found the category
  if (editCategory === data.name) {
    if (data.id === data.parent_id) return ''; // Root level
    return categoryName.join(' > '); // Parent chain (excluding the matched category)
  }

  // Stop condition: If it's a root category
  if (data.id === data.parent_id) {
    return data.name;
  }

  // Recursive call (Check for parent)
  if (parentData != null) {
    return renderCategoryOptions(
      parentData,
      initialValues,
      categoryArray,
      editCategory,
      visited, // Pass visited set
    );
  } else {
    return categoryArray.reverse().join(' > '); // Final formatted string
  }
};
