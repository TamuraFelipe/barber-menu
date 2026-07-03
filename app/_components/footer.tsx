import Container from "./container"
import { Card, CardContent } from "./ui/card"

const Footer = () => {
  return (
    <footer className="mt-6">
      <Card className="rounded-none py-6">
        <CardContent>
          <Container>
            <p className="text-sm text-gray-400">
              © 2023 Copyright - <span className="font-bold">Barber Menu</span>
            </p>
          </Container>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
