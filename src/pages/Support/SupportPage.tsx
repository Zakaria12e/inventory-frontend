import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const SupportPage = () => {
  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold mb-4">Support</h1>
      <Card>
        <CardContent className="p-6 text-gray-500">
          Contact support or send feedback about EUROHINCA Inventory App.
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SupportPage
