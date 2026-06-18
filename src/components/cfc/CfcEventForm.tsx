"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { resolveCfcUploadUrl } from "@/lib/cfc/media";
import type { CfcEventImage } from "@/types/cfc-portal";

export type CfcEventFormState = {
  event_name: string;
  event_date: string;
};

type CfcEventFormProps = {
  initial?: Partial<CfcEventFormState>;
  existingImages?: CfcEventImage[];
  onSubmit: (values: CfcEventFormState, newImages: File[]) => Promise<void>;
  onDeleteImage?: (imageId: number) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  fieldErrors?: Record<string, string>;
  isSubmitting?: boolean;
};

export default function CfcEventForm({
  initial,
  existingImages = [],
  onSubmit,
  onDeleteImage,
  onCancel,
  submitLabel = "Save Event",
  fieldErrors = {},
  isSubmitting = false,
}: CfcEventFormProps) {
  const [eventName, setEventName] = useState(initial?.event_name ?? "");
  const [eventDate, setEventDate] = useState(initial?.event_date ?? "");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewImages((prev) => [...prev, ...files].slice(0, 20));
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ event_name: eventName.trim(), event_date: eventDate }, newImages);
  };

  return (
    <form className="cfc-portal-form" onSubmit={handleSubmit} noValidate>
      <div className="cfc-portal-field">
        <label htmlFor="cfc-event-name">Event name</label>
        <input
          id="cfc-event-name"
          type="text"
          maxLength={255}
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.event_name ? <p className="cfc-portal-field-error">{fieldErrors.event_name}</p> : null}
      </div>

      <div className="cfc-portal-field">
        <label htmlFor="cfc-event-date">Event date</label>
        <input
          id="cfc-event-date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.event_date ? <p className="cfc-portal-field-error">{fieldErrors.event_date}</p> : null}
      </div>

      <div className="cfc-portal-field">
        <label htmlFor="cfc-event-images">Images (optional)</label>
        <input
          id="cfc-event-images"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFilesChange}
          disabled={isSubmitting}
        />
        <p className="cfc-portal-field-hint">Up to 20 images, 10 MB each. JPEG, PNG, WebP, GIF.</p>
        {fieldErrors.images ? <p className="cfc-portal-field-error">{fieldErrors.images}</p> : null}
      </div>

      {(existingImages.length > 0 || previews.length > 0) && (
        <div className="cfc-portal-image-grid">
          {existingImages.map((img) => (
            <div key={img.id} className="cfc-portal-image-card">
              <Image
                src={resolveCfcUploadUrl(img.image)}
                alt=""
                width={160}
                height={120}
                unoptimized
              />
              {onDeleteImage ? (
                <button
                  type="button"
                  className="cfc-portal-image-remove"
                  disabled={isSubmitting || deletingImageId === img.id}
                  onClick={async () => {
                    setDeletingImageId(img.id);
                    try {
                      await onDeleteImage(img.id);
                    } finally {
                      setDeletingImageId(null);
                    }
                  }}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
          {previews.map((src, index) => (
            <div key={src} className="cfc-portal-image-card">
              <Image src={src} alt="" width={160} height={120} unoptimized />
              <button
                type="button"
                className="cfc-portal-image-remove"
                disabled={isSubmitting}
                onClick={() => removeNewImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="cfc-portal-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
