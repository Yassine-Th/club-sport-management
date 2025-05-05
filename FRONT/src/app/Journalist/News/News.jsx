import { useState } from "react"
import React from "react"
import {
  Button,
  Card,
  Text,
  TextInput,
  Textarea,
  Select,
  Group,
  Stack,
  Title,
  Container,
  FileInput,
} from "@mantine/core"
import { IconUpload } from "@tabler/icons-react"

export default function FormNews() {
  const [image, setImage] = useState(null)
  const [formValues, setFormValues] = useState({
    journalist_id: "",
    title: "",
    content: "",
    category: "",
  })

  const handleChange = (value, name) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ ...formValues, image })
    // Ici vous pouvez ajouter la logique pour envoyer les données
  }

  return (
    <Container size="sm" px="xs">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Title order={3}>Publier un Article</Title>
          <Text size="sm" c="dimmed">
            Remplissez le formulaire pour soumettre un nouvel article
          </Text>
        </Card.Section>

        <form onSubmit={handleSubmit}>
          <Stack spacing="md" mt="md">
            <TextInput
              label="ID du Journaliste"
              id="journalist_id"
              name="journalist_id"
              placeholder="Entrez votre ID de journaliste"
              required
              value={formValues.journalist_id}
              onChange={(e) => handleChange(e.target.value, "journalist_id")}
            />

            <TextInput
              label="Titre"
              id="title"
              name="title"
              placeholder="Titre de l'article"
              required
              value={formValues.title}
              onChange={(e) => handleChange(e.target.value, "title")}
            />

            <Textarea
              label="Contenu"
              id="content"
              name="content"
              placeholder="Contenu de l'article"
              minRows={6}
              required
              value={formValues.content}
              onChange={(e) => handleChange(e.target.value, "content")}
            />

            <FileInput
              label="Image"
              placeholder="Choisir une image"
              accept="image/*"
              icon={<IconUpload size={14} />} // Utilisation correcte de la propriété "icon"
              value={image}
              onChange={setImage}
            />

            <Select
              label="Catégorie"
              id="category"
              placeholder="Sélectionnez une catégorie"
              data={[
                { value: "match", label: "Match" },
                { value: "transfer", label: "Transfert" },
                { value: "club", label: "Club" },
                { value: "other", label: "Autre" },
              ]}
              value={formValues.category}
              onChange={(value) => handleChange(value, "category")}
            />
          </Stack>

          <Group position="right" mt="xl">
            <Button type="submit" fullWidth>
              Publier l'Article
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  )
}
