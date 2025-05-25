import { Model, PopulateOptions } from "mongoose";

/**
 * Performs pagination on a Mongoose model query
 * @template T - The document type of the model
 * @param {Model<T>} model - The Mongoose model to query
 * @param {number} page - The current page number (1-based)
 * @param {number} limit - The number of items per page
 * @param {Record<string, any>} [query={}] - Optional query parameters for filtering
 * @returns {Promise<{
 *   total: number,
 *   page: number,
 *   limit: number, 
 *   totalPages: number,
 *   data: T[]
 * }>} Pagination result containing paginated data and metadata:
 *   - total: Total number of matching documents
 *   - page: Current page number 
 *   - limit: Number of items per page
 *   - totalPages: Total number of pages
 *   - data: Array of documents on current page
 */
export const paginate = async <T>(
    model: Model<T>,
    page: number,
    limit: number,
    query: Record<string, any> = {},
    populateOptions?: PopulateOptions | (PopulateOptions | string)[]
): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: T[];
}> => {
	const skip = (page - 1) * limit;
    const query_builder = model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (populateOptions) {
        query_builder.populate(populateOptions);
    }
    const data = await query_builder.exec();
	const total = await model.countDocuments(query).exec();

	return { total, page, limit, totalPages: Math.ceil(total / limit), data };
};
