import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const ReportsPage = () => {
  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold mb-4">Reports & Analytics</h1>
      <Card>
        <CardContent className="p-6 text-gray-500">
          Generate and analyze inventory and supplier performance reports.
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ReportsPage
