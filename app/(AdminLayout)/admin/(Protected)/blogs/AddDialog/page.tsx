"use client";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PencilLine,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Image as ImageIcon,
} from "lucide-react";
import { BlogsCardType } from "@/lib/types/blog";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  text: z.string().min(10, "Text must be at least 10 characters"),
  coverImage: z.string().min(1, "Cover image is required"),
});

type FormData = z.infer<typeof schema>;

interface SimplifiedFormProps {
  setRefreshData: any;
  edit?: Boolean;
  onSubmit?: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  item?: BlogsCardType | null;
  setItem?: any;
}

// Rich Text Editor Component
const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start writing...",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] max-w-none p-4",
      },
    },
  });

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="border-b p-2 flex gap-2 flex-wrap bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <div className="w-px bg-gray-200 mx-1" />
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <div className="w-px bg-gray-200 mx-1" />
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
          title="Add Image"
        >
          <ImageIcon size={18} />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
};

export default function AddDialog({
  onSubmit: onSubmitProp,
  setRefreshData,
  edit = false,
  item = null,
  setItem = null,
  initialData,
}: SimplifiedFormProps) {
  const [coverImage, setCoverImage] = useState<string>(
    initialData?.coverImage || ""
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editorContent, setEditorContent] = useState<string>(
    initialData?.text || ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      text: initialData?.text || "",
      coverImage: initialData?.coverImage || "",
    },
    mode: "onSubmit",
  });

  const handleCoverImageUpload = (url: string) => {
    setCoverImage(url);
    setValue("coverImage", url);
  };

  const handleEditorChange = (html: string) => {
    setEditorContent(html);
    setValue("text", html);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (onSubmitProp) {
        await onSubmitProp(data);
      } else {
        // Default submission behavior
        const res = await fetch(
          edit ? `/api/admin/blogs/${item?._id}` : "/api/admin/blogs",
          {
            method: edit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (!res.ok) throw new Error("Failed to submit");
        const responseData = await res.json();
        console.log("API response:", responseData);
        if (!edit) {
          setRefreshData((s: any) => s + 1);
        } else {
          setItem(responseData.blog);
        }
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error("submit error", err);
    }
  };

  useEffect(() => {
    if (item) {
      reset({
        coverImage: item.coverImage || "",
        title: item.title || "",
        text: item.text || "",
      });
      setCoverImage(item.coverImage);
      setEditorContent(item.text || "");
    }
  }, [item?.coverImage, item?.title, item?.text]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {edit ? (
          <Button className="flex text-white bg-[#38B89A] text-[20px] px-[20px] h-[50px]">
            <PencilLine size={26} />
            Edit
          </Button>
        ) : (
          <Button
            variant={"main_green_button"}
            className="w-full md:w-fit h-[50px]"
          >
            Add Blog
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[95vw] lg:min-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogTitle></DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[24px] w-full bg-white"
        >
          <h4 className="text-xl md:text-[24px] font-[600] text-center mb-2">
            {edit ? "Edit " : "Add "}
            Blog
          </h4>
          <div className="w-full h-[150px] box-shadows-2 flex justify-start items-end relative">
            <div className="w-full h-fit flex justify-start items-start flex-col pt-4">
              <AvatarUpload
                currentAvatar={coverImage}
                onAvatarUpload={handleCoverImageUpload}
                size={70}
                className="mx-auto"
              />
              <span className="plan-text-style-4">Cover Image</span>
              <span className="text-[14px] font-[400] text-[#51606e] pt-1">
                This image will be displayed as the cover of your blog
              </span>
            </div>
          </div>
          {errors.coverImage && (
            <p className="text-red-500 text-sm">{errors.coverImage.message}</p>
          )}

          {/* Fields */}
          <div className="w-full">
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div className="flex flex-col gap-[10px]">
                <Label
                  htmlFor="title"
                  className="text-xl md:text-[24px] font-[600]"
                >
                  Title <span className="text-red-500 ml-1">*</span>
                </Label>
                <Controller
                  name={"title"}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="title"
                      className="input-style"
                      placeholder="Enter Title"
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Rich Text Editor */}
              <div className="flex flex-col gap-[10px]">
                <Label
                  htmlFor="text"
                  className="text-xl md:text-[24px] font-[600]"
                >
                  {edit ? "Edit " : "Add "}
                  Blog <span className="text-red-500 ml-1">*</span>
                </Label>
                <RichTextEditor
                  value={editorContent}
                  onChange={handleEditorChange}
                  placeholder="Start writing your blog..."
                />
                {errors.text && (
                  <p className="text-red-500 text-sm">{errors.text.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex justify-center gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="main_green_button"
              size="lg"
              className="w-full"
              loading={isSubmitting}
            >
              {isSubmitting ? "Saving..." : edit ? "Edit " : "Add "}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
