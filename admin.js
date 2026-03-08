let campanhaId = null

function tratarValor(v){
  const limpo = String(v || "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")

  const numero = parseFloat(limpo)
  return isNaN(numero) ? 0 : numero
}

function formatarValorInput(v){
  if (v === null || v === undefined || v === "") return ""

  return Number(v).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

async function buscarCampanha(){
  const { data, error } = await sb
    .from("campaigns")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error){
    document.getElementById("msg").innerText = error.message
    return null
  }

  if (data) return data

  const { data: nova, error: erroNova } = await sb
    .from("campaigns")
    .insert({
      ativa: false,
      titulo: "",
      valor: 0,
      premiacao: "",
      chave_pix: "",
      nome_rifa: ""
    })
    .select()
    .maybeSingle()

  if (erroNova){
    document.getElementById("msg").innerText = erroNova.message
    return null
  }

  return nova
}

async function carregar(){
  const campanha = await buscarCampanha()

  if (!campanha){
    document.getElementById("msg").innerText = "Campanha não encontrada"
    return
  }

  campanhaId = campanha.id

  document.getElementById("nome").value = campanha.nome_rifa || ""
  document.getElementById("valor").value = formatarValorInput(campanha.valor)
  document.getElementById("premio").value = campanha.premiacao || ""
  document.getElementById("pix").value = campanha.chave_pix || ""

  document.getElementById("msg").innerText = campanha.ativa ? "Rifa ligada" : "Rifa desligada"
}

async function salvar(){
  const campanha = await buscarCampanha()

  if (!campanha){
    document.getElementById("msg").innerText = "Campanha não encontrada"
    return
  }

  campanhaId = campanha.id

  const nome = document.getElementById("nome").value.trim()
  const valor = tratarValor(document.getElementById("valor").value)
  const premio = document.getElementById("premio").value.trim()
  const pix = document.getElementById("pix").value.trim()

  const { error } = await sb
    .from("campaigns")
    .update({
      nome_rifa: nome,
      titulo: nome,
      valor: valor,
      premiacao: premio,
      chave_pix: pix,
      ativa: true
    })
    .eq("id", campanhaId)

  if (error){
    document.getElementById("msg").innerText = error.message
    return
  }

  await carregar()
  document.getElementById("msg").innerText = "Rifa salva e ligada"
}

async function desligar(){
  const campanha = await buscarCampanha()

  if (!campanha){
    document.getElementById("msg").innerText = "Campanha não encontrada"
    return
  }

  campanhaId = campanha.id

  const { error } = await sb
    .from("campaigns")
    .update({
      ativa: false,
      nome_rifa: "",
      titulo: "",
      valor: 0,
      premiacao: "",
      chave_pix: ""
    })
    .eq("id", campanhaId)

  if (error){
    document.getElementById("msg").innerText = error.message
    return
  }

  document.getElementById("nome").value = ""
  document.getElementById("valor").value = ""
  document.getElementById("premio").value = ""
  document.getElementById("pix").value = ""

  document.getElementById("msg").innerText = "Rifa desligada"
}

carregar()
