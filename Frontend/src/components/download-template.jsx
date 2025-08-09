import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function DownloadTemplate() {
  const downloadExcelTemplate = () => {
    const templateData = [
      ['Title', 'Description', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Explanation', 'Time Limit (sec)'],
      ['Sample Quiz', 'A sample quiz for demonstration', 'What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', '3', 'Paris is the capital of France', '30'],
      ['Sample Quiz', 'A sample quiz for demonstration', 'Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', '2', 'Mars appears red due to iron oxide', '30'],
      ['Sample Quiz', 'A sample quiz for demonstration', 'What is 2 + 2?', '3', '4', '5', '6', '2', 'Basic arithmetic: 2 + 2 = 4', '30']
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(templateData)

    ws['!cols'] = [
      { width: 15 }, { width: 20 }, { width: 30 }, { width: 15 }, 
      { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 }, 
      { width: 25 }, { width: 15 }
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Quiz Template')
    XLSX.writeFile(wb, 'quiz-template.xlsx')
  }

  const downloadCSVTemplate = () => {
    const csvContent = `Title,Description,Question,Option A,Option B,Option C,Option D,Correct Answer,Explanation,Time Limit (sec)
"Sample Quiz","A sample quiz for demonstration","What is the capital of France?","London","Berlin","Paris","Madrid","3","Paris is the capital of France","30"
"Sample Quiz","A sample quiz for demonstration","Which planet is known as the Red Planet?","Venus","Mars","Jupiter","Saturn","2","Mars appears red due to iron oxide","30"
"Sample Quiz","A sample quiz for demonstration","What is 2 + 2?","3","4","5","6","2","Basic arithmetic: 2 + 2 = 4","30"`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quiz-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button
        variant="outline"
        onClick={downloadExcelTemplate}
        className="flex items-center">
        <Download className="w-4 h-4 mr-2" />
        Download Excel Template
      </Button>
      <Button
        variant="outline"
        onClick={downloadCSVTemplate}
        className="flex items-center">
        <Download className="w-4 h-4 mr-2" />
        Download CSV Template
      </Button>
    </div>
  );
}
