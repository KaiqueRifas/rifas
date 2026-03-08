function formatarReal(v){
  return Number(v || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

async function carregar(){
  const { data, error } = await sb
    .from("campaigns")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)

  const titulo = document.getElementById("titulo")
  const status = document.getElementById("status")
  const valor = document.getElementById("valor")
  const premio = document.getElementById("premio")
  const pix = document.getElementById("pix")

  if (error || !data || data.length === 0){
    titulo.innerText = "Rifa"
    status.innerText = "Rifa desligada"
    valor.innerText = ""
    premio.innerText = ""
    pix.innerText = ""
    return
  }

  const campanha = data[0]

  if (!campanha.ativa){
    titulo.innerText = "Rifa"
    status.innerText = "Rifa desligada"
    valor.innerText = ""
    premio.innerText = ""
    pix.innerText = ""
    return
  }

  titulo.innerText = campanha.nome_rifa || "Rifa"
  status.innerText = "Rifa ligada"
  valor.innerText = "Valor: R$ " + formatarReal(campanha.valor)
  premio.innerText = campanha.premiacao ? "Premiações:\n" + campanha.premiacao : ""
  pix.innerText = campanha.chave_pix ? "Pix: " + campanha.chave_pix : ""
}

carregar()
setInterval(carregar, 2000)
