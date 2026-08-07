import { createClient } from '@supabase/supabase-js';

// Conexão direta ao Supabase
const supabaseUrl = 'https://omtlfwrrqketuaxufmkd.supabase.co';
const supabaseKey = 'sb_publishable_xQl--9rJB4QN7cwv2EOTnQ_-v7urxK6';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configuração para permitir chamadas do formulário
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. LER PRODUTOS (GET)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Erro GET Supabase:', error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. GUARDAR PRODUTO (POST)
  if (req.method === 'POST') {
    try {
      const { nome, preco, categoria, letra, icone, imagem } = req.body;

      if (!nome || !preco || !categoria) {
        return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
      }

      const { data, error } = await supabase
        .from('produtos')
        .insert([
          { 
            nome, 
            preco: parseFloat(preco), 
            categoria, 
            letra: (letra || 'A').toUpperCase(), 
            icone: icone || 'fa-box', 
            imagem: imagem || '' 
          }
        ]);

      if (error) {
        console.error('Erro POST Supabase:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ message: 'Produto guardado com sucesso!', data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}