import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import axios from 'axios'
import type { AxiosProgressEvent } from 'axios'

// components
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// api
import getS3PutUrl from '@/api/getS3PutUrl'
import getS3SignedUrl from '@/api/getS3SignedUrl'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'] as const

const formSchema = z.object({
  profileImage: z
    .instanceof(File, { message: 'Please select an image' })
    .refine(
      (file) => ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number]),
      'Only .jpg and .png files are accepted',
    ),
})

type FormValues = z.infer<typeof formSchema>

const App = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  console.log(uploadedUrl)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: FormValues) => {
    const file = values.profileImage as File;

    const data = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }

    const {
      signedLink,
      mimeType,
      uniqueKeyName,
    } = await getS3PutUrl(data).catch(() => {
      toast.error('Failed to get signed URL', { position: 'top-center' })
      return null
    })

    if (!signedLink || !mimeType || !uniqueKeyName) {
      toast.error('Failed to get signed URL', { position: 'top-center' })
      return
    }

    setUploadProgress(0)

    try {
      const config = {
        headers: {
          'Content-Type': mimeType,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => setUploadProgress(progressEvent.progress * 100),
      }

      const awsResp = await axios.put(signedLink, file, config).catch((error) => {
        toast.error('Failed to upload file', { position: 'top-center' })
        console.error(error)
        return null
      })

      setUploadProgress(null);

      if (awsResp.status !== 200) {
        toast.error('Failed to upload file', { position: 'top-center' })
        console.error(awsResp)
        return
      }

      const signedUrlResp = await getS3SignedUrl({ key: uniqueKeyName }).catch((error) => {
        toast.error('Failed to finalize upload', { position: 'top-center' })
        console.error(error)
        return null
      })

      setUploadedUrl(signedUrlResp.signedUrl)

      toast.success('File uploaded successfully', { position: 'top-center' })

    } catch (error) {
      toast.error('Failed to upload file', { position: 'top-center' })
      console.error(error)
    }

  }

  function handleCancel() {
    form.reset()
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setUploadProgress(null)
  }

  return (
    <div className="container mx-auto max-w-lg px-4">
      <div className="mt-3 space-y-4">
        <div id="current-image">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Selected preview"
              className="mx-auto max-h-48 rounded-md object-contain"
            />
          )}
        </div>

        <Form {...form}>
          <form
            id="file-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 rounded-lg border p-4 text-left"
          >
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <FormLabel htmlFor="profile-image">Profile image</FormLabel>
                  <FormControl>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/png, image/jpeg"
                      name={name}
                      ref={ref}
                      onBlur={onBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        onChange(file)
                        setPreviewUrl((prev) => {
                          if (prev) URL.revokeObjectURL(prev)
                          return file ? URL.createObjectURL(file) : null
                        })
                      }}
                    />
                  </FormControl>
                  <FormDescription>Accepts: .jpg, .png</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit">Continue</Button>
              <Button type="button" variant="destructive" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>

        {uploadProgress !== null && (
          <div id="progress-wrapper" className="space-y-2">
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadedUrl && (
          <div id="uploaded-image">
            <img src={uploadedUrl} alt="Uploaded image" className="mx-auto max-h-48 rounded-md object-contain" />
          </div>
        )}
      </div>
    </div>
  )
};

export default App;
