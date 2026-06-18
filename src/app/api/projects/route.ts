import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "src", "projects");

export async function GET() {
  try {
    if (!fs.existsSync(projectsDirectory)) {
      return NextResponse.json([]);
    }
    
    const fileNames = fs.readdirSync(projectsDirectory);
    const projects = fileNames
      .filter((fileName) => !fileName.startsWith('_') && (fileName.endsWith('.mdx') || fileName.endsWith('.md')))
      .map((fileName) => {
        const fullPath = path.join(projectsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);
        
        // Return only the frontmatter data for the list view
        return data;
      })
      // Sort projects by ID or date if needed. Currently sorting by ID.
      .sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error reading projects:", error);
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}
