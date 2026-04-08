export interface AddonImport {
  module: string;
  path: string;
}

export interface AddonManifest {
  name: string;
  description: string;
  category: 'database' | 'auth' | 'feature';
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  envVars: Record<string, string>;
  imports: AddonImport[];
  conflicts?: string[];
}

export interface GenerateOptions {
  projectName: string;
  addons: string[];
  outputDir: string;
}
