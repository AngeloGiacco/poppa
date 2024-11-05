"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatDistance } from 'date-fns'
import { supabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/database.types'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '@/components/loading'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { learnable_languages } from '@/lib/supportedLanguages'
import { useSearchParams } from 'next/navigation'

type Lesson = Database['public']['Tables']['lesson']['Row'] & {
  languages: Database['public']['Tables']['languages']['Row'] | null
}

export default function HistoryPage() {
  const [lessons, setLessons] = useState<Lesson[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  const languageCode = searchParams.get('language')
  const selectedLanguage = learnable_languages.find(lang => lang.code === languageCode)

  useEffect(() => {
    async function fetchLessons() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabaseBrowserClient.auth.getUser()
        
        const query = supabaseBrowserClient
          .from('lesson')
          .select(`
            id,
            created_at,
            transcript,
            subject,
            languages!inner (
              name,
              code
            )
          `)
          .eq('user', user?.id)

        if (languageCode) {
          query.eq('languages.code', languageCode)
        }

        const { data } = await query.order('created_at', { ascending: false })
        setLessons(data)
      } catch (error) {
        console.error('Error fetching lessons:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLessons()
  }, [languageCode])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-full shadow-md px-6 py-3">
          <Link 
            href="/dashboard" 
            className="flex items-center text-sm text-[#8B4513] hover:text-[#6D3611] transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto pt-32 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-[#8B4513] text-center flex items-center justify-center gap-3">
            {selectedLanguage ? (
              <>
                <selectedLanguage.icon className="w-8 h-8" />
                {`${selectedLanguage.name} lessons`}
              </>
            ) : (
              'Lesson History'
            )}
          </h1>

          <div className="grid gap-4 max-w-3xl mx-auto">
            {lessons?.map((lesson: Lesson) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedTranscript(lesson.transcript)
                    setIsDialogOpen(true)
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-[#8B4513] mb-1">
                          {lesson.subject || lesson.languages?.name}
                        </h3>
                        <p className="text-sm text-[#8B4513]/70">
                          {formatDistance(new Date(lesson.created_at), new Date(), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-[#8B4513] hover:bg-[#8B4513]/5"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setSelectedTranscript(lesson.transcript)
                          setIsDialogOpen(true)
                        }}
                      >
                        View Transcript
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {lessons?.length === 0 && (
              <div className="text-center text-[#8B4513]/70 py-8">
                No lessons found. Start learning to see your history!
              </div>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-white/95 border-[#8B4513]/20 shadow-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-[#8B4513] text-xl">
                  Lesson Transcript
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="text-[#8B4513]/70 whitespace-pre-wrap">
                  {selectedTranscript}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>
    </div>
  )
}
