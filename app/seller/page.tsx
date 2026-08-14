"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, CheckCircle2, LayoutDashboard, Package, Plus, Save, Store, Trash2, Upload, User, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { productService } from "@/lib/services/productService";
import { requestBackend } from "@/lib/backend";
import { CategoryOption, Product } from "@/types/product";

type SellerProfile = {
  id: string | number;
  companyName: string;
  companyEmail: string;
  companyMobile: string;
};

type SellerOption = {
  id: string | number;
  companyName: string;
};

type AccessState = {
  allowed: boolean;
  redirectTo: string | null;
  role: string;
};

type SelectedImageFile = {
  id: string;
  file: File;
  previewUrl: string;
};

type ProductFormState = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  sellerId: string;
  price: string;
  qty: string;
  images: string[];
};

const resolveInitialAccess = (): AccessState => {
  if (typeof window === "undefined") {
    return { allowed: false, redirectTo: null, role: "" };
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return { allowed: false, redirectTo: "/sign-in?returnTo=/seller", role: "" };
  }

  try {
    const rawUser = localStorage.getItem("user");
    const currentUser = rawUser ? (JSON.parse(rawUser) as { role?: string }) : null;
    const role = String(currentUser?.role ?? "").toLowerCase();

    if (role && role !== "seller" && role !== "admin" && role !== "superadmin") {
      return { allowed: false, redirectTo: "/account/overview", role };
    }

    return { allowed: true, redirectTo: null, role };
  } catch {
    return { allowed: false, redirectTo: "/sign-in?returnTo=/seller", role: "" };
  }
};

const isSupportedImageFile = (file: File) => file.type.startsWith("image/");

const getFileSignature = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

const createSelectedImageFile = (file: File): SelectedImageFile => ({
  id: `${getFileSignature(file)}:${Math.random().toString(36).slice(2, 10)}`,
  file,
  previewUrl: URL.createObjectURL(file),
});

const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  const sizeInKilobytes = sizeInBytes / 1024;
  if (sizeInKilobytes < 1024) {
    return `${sizeInKilobytes.toFixed(1)} KB`;
  }

  return `${(sizeInKilobytes / 1024).toFixed(1)} MB`;
};

const emptyForm = (sellerId = ""): ProductFormState => ({
  id: "",
  name: "",
  description: "",
  categoryId: "",
  sellerId,
  price: "",
  qty: "",
  images: [],
});

const apiChecklist = [
  "GET /categories for product category options",
  "GET /products/mine for seller/admin inventory",
  "POST /products with multipart form-data",
  "PUT /products/{id} with multipart form-data",
  "GET /uploads/products/{fileName} for saved images",
];

const SellerPage = () => {
  const [access] = useState(resolveInitialAccess);
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [sellerOptions, setSellerOptions] = useState<SellerOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [selectedFiles, setSelectedFiles] = useState<SelectedImageFile[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!access.allowed && access.redirectTo) {
      window.location.replace(access.redirectTo);
      return;
    }
  }, [access.allowed, access.redirectTo]);

  const loadInventory = async () => {
    const [productsResponse, categoriesResponse] = await Promise.all([
      productService.getMyProducts().catch(() => []),
      productService.getCategories().catch(() => []),
    ]);

    setProducts(productsResponse);
    setCategories(categoriesResponse);
  };

  const updateSelectedFiles = (nextFiles: SelectedImageFile[]) => {
    setSelectedFiles((currentFiles) => {
      const nextIds = new Set(nextFiles.map((file) => file.id));

      currentFiles.forEach((file) => {
        if (!nextIds.has(file.id)) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });

      return nextFiles;
    });
  };

  const handleIncomingFiles = (incomingFiles: File[] | FileList | null) => {
    const files = incomingFiles ? Array.from(incomingFiles) : [];

    if (files.length === 0) {
      return;
    }

    const currentSignatures = new Set(selectedFiles.map((file) => getFileSignature(file.file)));
    const skippedFiles: string[] = [];
    const acceptedFiles = files.reduce<SelectedImageFile[]>((accumulator, file) => {
      if (!isSupportedImageFile(file)) {
        skippedFiles.push(file.name);
        return accumulator;
      }

      const signature = getFileSignature(file);
      if (currentSignatures.has(signature) || accumulator.some((item) => getFileSignature(item.file) === signature)) {
        skippedFiles.push(file.name);
        return accumulator;
      }

      accumulator.push(createSelectedImageFile(file));
      return accumulator;
    }, []);

    if (acceptedFiles.length > 0) {
      updateSelectedFiles([...selectedFiles, ...acceptedFiles]);
      setDragActive(false);
    }

    if (skippedFiles.length > 0) {
      setUploadError(
        `Skipped ${skippedFiles.length} file${skippedFiles.length > 1 ? "s" : ""}: ${skippedFiles.join(
          ", "
        )}. Only image files are allowed.`
      );
      return;
    }

    setUploadError("");
  };

  const clearSelectedFiles = () => {
    updateSelectedFiles([]);
  };

  useEffect(() => {
    if (!access.allowed) {
      return;
    }

    const loadSellerWorkspace = async () => {
      try {
        const profileResponse = await requestBackend<Record<string, unknown>>("/sellers/me").catch(() => null);
        const rawProfile = (profileResponse?.seller ?? profileResponse?.data ?? profileResponse) as Record<string, unknown> | null;

        if (rawProfile) {
          setProfile({
            id: rawProfile.id ?? "",
            companyName: String(rawProfile.companyName ?? rawProfile.name ?? ""),
            companyEmail: String(rawProfile.companyEmail ?? rawProfile.email ?? ""),
            companyMobile: String(rawProfile.companyMobile ?? rawProfile.phone ?? ""),
          });
          setForm((current) => ({
            ...current,
            sellerId: String(rawProfile.id ?? current.sellerId),
          }));
        }

        const sellerListResponse = await requestBackend<Record<string, unknown>>("/admin/sellers").catch(() => null);
        const sellerRows = Array.isArray((sellerListResponse as { sellers?: unknown[] } | null)?.sellers)
          ? (sellerListResponse as { sellers: Array<Record<string, unknown>> }).sellers
          : [];

        setSellerOptions(
          sellerRows.map((row) => ({
            id: row.id ?? "",
            companyName: String(row.companyName ?? row.name ?? "Seller"),
          }))
        );

        await loadInventory();
      } catch {
        setProfile(null);
        setSellerOptions([]);
        setProducts([]);
        setCategories([]);
      }
    };

    loadSellerWorkspace();
  }, [access.allowed]);

  const stats = useMemo(
    () => [
      { label: "Products", value: String(products.length), icon: Package },
      { label: "Categories", value: String(categories.length), icon: LayoutDashboard },
      { label: "Images", value: String(products.reduce((total, product) => total + (product.images?.length ?? 0), 0)), icon: Upload },
      { label: "Seller access", value: access.role || "seller", icon: BadgeCheck },
    ],
    [access.role, categories.length, products]
  );

  const resetForm = () => {
    setForm(emptyForm(form.sellerId || profile?.id?.toString() || ""));
    clearSelectedFiles();
    setUploadError("");
    setMessage("");
  };

  const editProduct = (product: Product) => {
    setForm({
      id: String(product.id),
      name: product.name,
      description: product.description ?? "",
      categoryId: String((product as { categoryId?: number }).categoryId ?? ""),
      sellerId: String(product.sellerId ?? form.sellerId ?? profile?.id ?? ""),
      price: String(product.price ?? ""),
      qty: String(product.availableQty ?? product.stock ?? 0),
      images: product.images ? [...product.images] : [],
    });
    clearSelectedFiles();
    setUploadError("");
    setMessage(`Editing ${product.name}`);
  };

  const removeExistingImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((currentFiles) => {
      const nextFiles = currentFiles.filter((_, fileIndex) => fileIndex !== index);
      const removedFile = currentFiles[index];

      if (removedFile) {
        URL.revokeObjectURL(removedFile.previewUrl);
      }

      return nextFiles;
    });
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (files: FileList | null) => {
    handleIncomingFiles(files);
  };

  const saveProduct = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        name: form.name,
        description: form.description,
        categoryId: Number(form.categoryId),
        sellerId: Number(form.sellerId || profile?.id || 0),
        price: Number(form.price),
        qty: Number(form.qty),
        images: form.images,
      };

      if (!payload.name.trim() || !payload.description.trim()) {
        throw new Error("Product name and description are required.");
      }

      if (!payload.categoryId) {
        throw new Error("Select a category.");
      }

      if (!payload.sellerId) {
        throw new Error("Select a seller.");
      }

      if (selectedFiles.length === 0 && form.images.length === 0 && !form.id) {
        throw new Error("Add at least one product image.");
      }

      const formData = new FormData();
      formData.append("product", JSON.stringify(payload));
      selectedFiles.forEach((selectedFile) => formData.append("images", selectedFile.file));

      if (form.id) {
        await productService.updateProduct(form.id, formData);
        setMessage("Product updated successfully.");
      } else {
        await productService.createProduct(formData);
        setMessage("Product created successfully.");
      }

      await loadInventory();
      resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCategoryName = categories.find((category) => String(category.id) === form.categoryId)?.name ?? "Choose a category";

  const productCountLabel = useMemo(() => {
    const totalImages = products.reduce((total, product) => total + (product.images?.length ?? 0), 0);
    return `${products.length} products · ${totalImages} images`;
  }, [products]);

  if (!access.allowed) {
    return <div className="flex-1 px-4 md:px-8 py-8">Loading seller workspace...</div>;
  }

  return (
    <main className="flex-1 px-4 md:px-8 py-8 space-y-6">
      <Card className="p-6 border-0 shadow-sm bg-linear-to-r from-amber-600 to-amber-400 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Seller Inventory</h1>
            <p className="text-sm text-white/90 max-w-2xl mt-2">
              Create and edit products, upload real product photos, and keep the catalog tied to the same images customers see in the storefront.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
            <Store className="w-4 h-4" />
            {profile ? profile.companyName : "Inventory workspace"}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="p-4 border-0 shadow-sm h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Sections</h2>
          <div className="space-y-2 text-sm">
            <a href="#profile" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              Store profile
            </a>
            <a href="#inventory" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              Inventory editor
            </a>
            <a href="#products" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              Product catalog
            </a>
            <a href="#apis" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              API contract
            </a>
          </div>
        </Card>

        <div className="space-y-6">
          <div id="profile" className="grid xl:grid-cols-[1fr_auto] gap-4">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-50 p-3 rounded-xl"><User className="w-6 h-6 text-amber-600" /></div>
                <div>
                  <h2 className="text-xl font-semibold">Seller Profile</h2>
                  <p className="text-sm text-gray-600">The active seller record that owns the uploaded catalog items.</p>
                </div>
              </div>

              {profile ? (
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-gray-500">Company</p>
                    <p className="font-medium mt-1">{profile.companyName}</p>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium mt-1">{profile.companyEmail}</p>
                  </div>
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium mt-1">{profile.companyMobile}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-6 text-sm text-gray-600">
                  No seller profile is linked to this account yet.
                </div>
              )}
            </Card>

            <Card className="p-6 border-0 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Quick Notes</h2>
              <div className="space-y-2 text-sm text-gray-600 leading-6">
                <p>• Uploaded images are stored on the backend and reused by product cards and galleries.</p>
                <p>• Image URLs are returned as frontend-safe paths through the API proxy.</p>
                <p>• The form below updates the same product row if you select an item from the inventory list.</p>
              </div>
            </Card>
          </div>

          <Card id="inventory" className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
              <div>
                <h2 className="text-xl font-semibold">Inventory Editor</h2>
                <p className="text-sm text-gray-600 mt-1">Create a new product or edit an existing one.</p>
              </div>
              <div className="rounded-full border bg-gray-50 px-4 py-2 text-sm text-gray-700">
                {productCountLabel}
              </div>
            </div>

            <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product name</label>
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="e.g. SiliconBay Dev Board"
                      className="w-full px-4 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={form.categoryId}
                      onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                      className="w-full px-4 py-2 border rounded-xl bg-white"
                    >
                      <option value="">{selectedCategoryName}</option>
                      {categories.map((category) => (
                        <option key={String(category.id)} value={String(category.id)}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={(event) => setForm({ ...form, price: event.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={form.qty}
                      onChange={(event) => setForm({ ...form, qty: event.target.value })}
                      placeholder="0"
                      className="w-full px-4 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="Describe what the product does and why it matters."
                    rows={5}
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Seller</label>
                    {access.role === "admin" || access.role === "superadmin" ? (
                      <select
                        value={form.sellerId}
                        onChange={(event) => setForm({ ...form, sellerId: event.target.value })}
                        className="w-full px-4 py-2 border rounded-xl bg-white"
                      >
                        <option value="">Select a seller</option>
                        {sellerOptions.map((seller) => (
                          <option key={String(seller.id)} value={String(seller.id)}>
                            {seller.companyName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={profile?.companyName ?? "Seller profile"}
                        readOnly
                        className="w-full px-4 py-2 border rounded-xl bg-gray-50"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Images</label>
                    <div
                      onClick={openFilePicker}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setDragActive(true);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setDragActive(false);
                        handleIncomingFiles(event.dataTransfer.files);
                      }}
                      className={`cursor-pointer rounded-xl border border-dashed p-4 transition ${dragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-gray-50"}`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => {
                          handleFileInputChange(event.target.files);
                          event.target.value = "";
                        }}
                        className="hidden"
                      />
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">Drag and drop product images here</p>
                          <p className="text-xs text-gray-500">or click to browse. JPG, PNG, GIF, WEBP, BMP, and SVG files are supported.</p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openFilePicker();
                          }}
                          className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Browse files
                        </button>
                      </div>
                      {uploadError ? <p className="mt-3 text-xs font-medium text-red-600">{uploadError}</p> : null}
                      {selectedFiles.length > 0 ? (
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {selectedFiles.map((selectedFile, index) => (
                            <div key={selectedFile.id} className="flex items-center gap-3 rounded-xl border bg-white p-3">
                              <img
                                src={selectedFile.previewUrl}
                                alt={selectedFile.file.name}
                                className="h-16 w-16 rounded-lg border object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{selectedFile.file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.file.size)}</p>
                              </div>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeSelectedFile(index);
                                }}
                                className="rounded-full border p-2 hover:bg-gray-50"
                                aria-label={`Remove ${selectedFile.file.name}`}
                              >
                                <Trash2 className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    onClick={saveProduct}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2 text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
                  >
                    {form.id ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {form.id ? "Update product" : "Create product"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                  {message ? <span className="text-sm text-gray-600">{message}</span> : null}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Upload className="w-4 h-4 text-amber-600" />
                    Current images
                  </div>
                  <div className="space-y-3">
                    {form.images.length > 0 ? (
                      form.images.map((image, index) => (
                        <div key={`${image}-${index}`} className="flex items-center gap-3 rounded-xl border bg-white p-3">
                          <img src={image} alt={`Product ${index + 1}`} className="h-16 w-16 rounded-lg object-cover border" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{image}</p>
                          </div>
                          <button onClick={() => removeExistingImage(index)} className="rounded-full border p-2 hover:bg-gray-50">
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No existing image URLs are attached yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-2 text-sm font-semibold mb-3">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-600" />
                      New files
                    </div>
                    {selectedFiles.length > 0 ? (
                      <button type="button" onClick={clearSelectedFiles} className="text-xs font-medium text-amber-700 hover:underline">
                        Clear all
                      </button>
                    ) : null}
                  </div>
                  <div className="space-y-3 text-sm text-gray-600">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((selectedFile, index) => (
                        <div key={selectedFile.id} className="flex items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900">{selectedFile.file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(selectedFile.file.size)}</p>
                          </div>
                          <button type="button" onClick={() => removeSelectedFile(index)} className="rounded-full border p-2 hover:bg-gray-50">
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No new files selected.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card id="products" className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div>
                <h2 className="text-xl font-semibold">Product Catalog</h2>
                <p className="text-sm text-gray-600 mt-1">Tap any card to load it into the editor above.</p>
              </div>
              <button
                onClick={loadInventory}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:bg-gray-50"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Refresh
              </button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-sm text-gray-600 md:col-span-2 xl:col-span-3">
                  No products have been uploaded yet.
                </div>
              ) : (
                products.map((product) => (
                  <button
                    key={String(product.id)}
                    onClick={() => editProduct(product)}
                    className="group text-left rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="aspect-4/3 overflow-hidden rounded-xl border bg-gray-50">
                      <img
                        src={product.images?.[0] ?? "/products/microcontroller.jpg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-4 space-y-1">
                      <p className="text-lg font-semibold line-clamp-1">{product.name}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between text-sm pt-2">
                        <span className="font-semibold text-amber-700">${product.price.toFixed(2)}</span>
                        <span className="text-gray-500">Qty {product.availableQty ?? product.stock ?? 0}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card id="apis" className="p-6 border-0 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">API Contract</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              {apiChecklist.map((item) => (
                <div key={item} className="rounded-xl border bg-gray-50 p-4">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default SellerPage;