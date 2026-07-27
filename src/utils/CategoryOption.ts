import {type CategoryDetailsTypes} from 'utils/TypeConfig';

export const renderCategoryOptions = (
  data: CategoryDetailsTypes,
  initialValues: CategoryDetailsTypes[] = [], // set a default value
  categoryName: string[] = [],
): string => {
  const parentData: CategoryDetailsTypes | undefined = initialValues?.find(
    innerData => innerData?.id === data?.parent_id,
  );
  const categoryArray = [...categoryName, data.name];
  if (data.id === data.parent_id) {
    const categoryOption = data.name;
    return categoryOption;
  }
  if (parentData != null) {
    return renderCategoryOptions(parentData, initialValues, categoryArray);
  } else {
    const categoryOption = categoryArray.reverse().join(' > ');
    return categoryOption;
  }
};
