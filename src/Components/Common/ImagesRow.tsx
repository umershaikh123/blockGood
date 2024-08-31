import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Dialog from "@mui/material/Dialog"

export default function ImageRowComponent() {
  const maxVisible = 6
  const imagesToShow = itemData.slice(0, maxVisible)
  const remainingCount = itemData.length - maxVisible

  const [open, setOpen] = React.useState(false)
  const [currentImage, setCurrentImage] = React.useState("")

  const handleOpen = (imageUrl: string) => {
    setCurrentImage(imageUrl)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {/* Image List Display */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          width: "100%",
          maxHeight: "312px",
          overflowY: "auto",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        {imagesToShow.map(item => (
          <Box
            key={item.img}
            sx={{
              width: 100,
              height: 100,
              cursor: "pointer",
              borderRadius: "8px",
              overflow: "hidden",
              flex: "0 0 auto",
            }}
            onClick={() => handleOpen(item.img)}
          >
            <img
              src={`${item.img}?w=100&h=100&fit=crop&auto=format`}
              srcSet={`${item.img}?w=100&h=100&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ))}

        {remainingCount > 0 && (
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e0e0e0",
              flex: "0 0 auto",
            }}
          >
            <Typography variant="h6" color="text.primary">
              +{remainingCount}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Dialog for Full Image Display */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <Box
          component="img"
          src={currentImage}
          alt="Selected Image"
          sx={{ width: "100%", height: "auto" }}
        />
      </Dialog>
    </>
  )
}
const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
]
