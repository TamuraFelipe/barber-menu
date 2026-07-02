import { Card, CardContent } from "./ui/card"

const Footer = () => {
  return (
    <footer>
      <Card className="rounded-none py-6">
        <CardContent>
          <p className="text-sm text-gray-400">
            © 2023 Copyright - <span className="font-bold">Barber Menu</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
