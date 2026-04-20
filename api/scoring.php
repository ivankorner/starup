<?php
// ============================================================================
// Scoring / Viabilidad — Cálculo automático de puntaje para respuestas
// ============================================================================
// Formato `opciones` soportado:
//   - string (legacy): "Texto opción"         → puntos = 0
//   - { "text": "...", "icon": "..." }        → card-3 legacy, puntos = 0
//   - { "texto": "...", "puntos": N }         → nuevo (chip/selector/timeline)
//   - { "texto": "...", "puntos": N, "icon" } → card-3 con puntaje
//
// Reglas:
//   - chip-single / selector-grid / timeline / card-3: suma puntos de opción elegida.
//   - chip-multi: suma puntos de todas las opciones seleccionadas.
//   - texto / textarea: suma `puntaje_completo` si respuesta no está vacía.
//   - Campos nombre / email nunca puntúan (no son form_fields).
//
// Máximo por campo:
//   - single: puntos de la opción con más puntos.
//   - multi: suma de puntos de todas las opciones.
//   - texto/textarea: puntaje_completo del campo.
//
// Normalización: score final = round((total_obtenido / total_maximo) * 100).
// Veredicto: >= 70 viable · >= 40 potencial · < 40 no-viable.
// ============================================================================

function normalizeOption($opt) {
    if (is_array($opt) || is_object($opt)) {
        $arr = (array)$opt;
        $texto = $arr['texto'] ?? $arr['text'] ?? '';
        $puntos = isset($arr['puntos']) ? (int)$arr['puntos'] : 0;
        $icon = $arr['icon'] ?? null;
        return ['texto' => (string)$texto, 'puntos' => $puntos, 'icon' => $icon];
    }
    return ['texto' => (string)$opt, 'puntos' => 0, 'icon' => null];
}

function optionMatches($optTexto, $userValue) {
    if ($userValue === null) return false;
    $userStr = is_string($userValue) ? $userValue : (string)$userValue;
    if ($optTexto === $userStr) return true;
    // Timeline: "Título|||Descripción" — el usuario guarda solo el título
    $primeraParte = explode('|||', $optTexto)[0];
    return $primeraParte === $userStr;
}

function resolveFieldValue($field, $respuestas) {
    $slug = $field['slug'] ?? null;
    $id = $field['id'];
    if ($slug !== null && array_key_exists($slug, $respuestas)) return $respuestas[$slug];
    if (array_key_exists($id, $respuestas)) return $respuestas[$id];
    if (array_key_exists((string)$id, $respuestas)) return $respuestas[(string)$id];
    return null;
}

function calcularScore($pdo, $formId, $respuestas) {
    $stmt = $pdo->prepare("
        SELECT id, tipo, slug, opciones, puntaje_completo
        FROM form_fields
        WHERE form_id = ?
    ");
    $stmt->execute([$formId]);
    $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalObtenido = 0;
    $totalMaximo = 0;

    foreach ($fields as $field) {
        $tipo = $field['tipo'];
        $puntajeCompleto = (int)($field['puntaje_completo'] ?? 0);
        $opciones = $field['opciones'] ? json_decode($field['opciones'], true) : [];
        if (!is_array($opciones)) $opciones = [];

        $value = resolveFieldValue($field, $respuestas);

        if (in_array($tipo, ['texto', 'textarea'])) {
            $totalMaximo += $puntajeCompleto;
            if (is_string($value) && trim($value) !== '') {
                $totalObtenido += $puntajeCompleto;
            }
        } elseif ($tipo === 'chip-multi') {
            $maxField = 0;
            foreach ($opciones as $opt) {
                $n = normalizeOption($opt);
                $maxField += $n['puntos'];
            }
            $totalMaximo += $maxField;

            if (is_array($value)) {
                foreach ($value as $sel) {
                    foreach ($opciones as $opt) {
                        $n = normalizeOption($opt);
                        if (optionMatches($n['texto'], $sel)) {
                            $totalObtenido += $n['puntos'];
                            break;
                        }
                    }
                }
            }
        } elseif (in_array($tipo, ['chip-single', 'selector-grid', 'timeline', 'card-3'])) {
            $maxField = 0;
            foreach ($opciones as $opt) {
                $n = normalizeOption($opt);
                if ($n['puntos'] > $maxField) $maxField = $n['puntos'];
            }
            $totalMaximo += $maxField;

            if ($value !== null && $value !== '') {
                foreach ($opciones as $opt) {
                    $n = normalizeOption($opt);
                    if (optionMatches($n['texto'], $value)) {
                        $totalObtenido += $n['puntos'];
                        break;
                    }
                }
            }
        }
    }

    $score = $totalMaximo > 0 ? (int)round(($totalObtenido / $totalMaximo) * 100) : 0;
    $score = max(0, min(100, $score));

    if ($score >= 70) $veredicto = 'viable';
    elseif ($score >= 40) $veredicto = 'potencial';
    else $veredicto = 'no-viable';

    return [
        'score' => $score,
        'veredicto' => $veredicto,
        'raw_obtenido' => $totalObtenido,
        'raw_maximo' => $totalMaximo,
    ];
}
