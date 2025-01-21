import Papa from "papaparse";
import { readFile, writeFile } from "fs/promises";

async function updateSubcategories() {
  try {
    // Read both CSV files
    const categoriesData = await readFile("categories_rows.csv", "utf-8");
    const subcategoriesData = await readFile(
      "import_subcategories.csv",
      "utf-8"
    );

    // Parse both CSVs
    const categories = Papa.parse(categoriesData, { header: true }).data;
    const subcategories = Papa.parse(subcategoriesData, { header: true }).data;

    // Create a map of category names to IDs
    const categoryMap = new Map();
    categories.forEach((category) => {
      categoryMap.set(category.name, category.id);
    });

    // Update subcategories with correct category_ids
    const updatedSubcategories = subcategories.map((subcategory) => {
      const categoryId = categoryMap.get(subcategory.category_name);
      if (!categoryId) {
        console.warn(
          `Warning: No category ID found for category name: ${subcategory.category_name}`
        );
      }
      return {
        name: subcategory.name,
        category_id: categoryId,
        user_id: subcategory.user_id,
        created_at: subcategory.created_at,
      };
    });

    // Write the updated subcategories to a new CSV
    await writeFile(
      "import_subcategories_with_ids.csv",
      Papa.unparse(updatedSubcategories, {
        header: true,
        newline: "\n",
      })
    );

    console.log("Successfully created import_subcategories_with_ids.csv");
    console.log(`Processed ${updatedSubcategories.length} subcategories`);
    console.log("\nPlease verify the new file before importing to Supabase");
  } catch (error) {
    console.error("Error updating subcategories:", error);
  }
}

updateSubcategories();
