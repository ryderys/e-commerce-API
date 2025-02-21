const ValidationMsg = {
    invalidMobile: 'Invalid mobile number',
    EmptyMobile: 'mobile number cannot be empty',
    EmptyCode: 'code cannot be empty',
    InvalidCode: 'Invalid code',
    InvalidTitle: 'Invalid title',
    InvalidDescription: 'Invalid description',
    InvalidSummary: 'Invalid summary',
    InvalidTag: 'Invalid tag',
    InvalidCategoryId: 'Invalid category id',
    InvalidPrice: 'Invalid price',
    InvalidQuantity: 'Invalid quantity',
    InvalidType: 'Invalid type',
    InvalidFileFormat: 'Invalid file Format',
    InvalidSlug: 'Invalid slug',
    InvalidIcon: 'Invalid Icon',
    InvalidId: 'Invalid ID',
    InvalidKey: 'Invalid key',
    InvalidList: 'list must be array or comma-separated string',
    InvalidGuid: 'the type of the sent guid is invalid',
    InvalidRating: 'rating must be a number and be at least 1 and cannot exceed 5',
    InvalidComment: 'comment must be an string less than 400 characters long',
    InvalidRole: 'assigned role is invalid',
    InvalidPermission: 'permissions are invalid',
    InvalidResource: 'the resource that you provided for granting permissions is invalid',
    InvalidAction: 'the action that you provided for granting permissions is invalid',
}

module.exports = {
    ValidationMsg
}