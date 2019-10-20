<?php
session_start();
if (isset($_GET["dir"])) {
    $current_dir = ($_GET["dir"]) . '/';
} else {
    $current_dir = __DIR__ . '/';
}
// Get tree for folders.
function tree($current_dir)
{
    $fold = basename(__DIR__);
    $folders = stristr($current_dir, $fold);
    $parts = explode('/', $folders);
    foreach ($parts as $part) {
        if ($part !== '') {
            $link = stristr($current_dir, $part, true) . $part;
            echo "<a href='?dir=" . $link . "'><i class=\"far fa-folder-open\"></i>$part</a>";
        }
    }
}
if ($handle = opendir($current_dir)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry !== '.' && $entry !== '..') {
            if (is_dir($current_dir . $entry)) {
                $folders[] = $entry;
            } elseif (is_file($current_dir . $entry)) {
                $files[] = $entry;
            }
        }
    }
}
// Sorting folders.
function folders($current_dir, $folders)
{
    if (isset($folders)) {
        sort($folders);
        foreach ($folders as $value) {
            echo "<a href='?dir=" . $current_dir . $value . "'><i class=\"far fa-folder\"></i>$value</a>";
        }
    } else {
        echo "<p>No folders found</p>";
    }
}
// Sorting files.
function files($current_dir, $files)
{
    // Sorting files.
    if (isset($files)) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        sort($files);
        foreach ($files as $value) {
            $file_date = date("F d Y H:i", filemtime($current_dir . $value));
            $file_size = filesize($current_dir . $value);
            $file_type = finfo_file($finfo, $current_dir . $value);
            if ($file_size > 1000000) {
                // HDD 1kb = 1000b.
                $size = round($file_size / 1000000, 1) . "Mb";
            } elseif ($file_size > 1000) {
                $size = round($file_size / 1000) . "kb";
            } else {
                $size = $file_size . "b";
            }
            echo <<<FILE
<tr><td><i class="far fa-file"></i>$value</td><td>$file_date</td><td>$size</td><td>$file_type</td></tr>
FILE;
        }
        finfo_close($finfo);
    } else {
        echo "<p>No files found</p>";
    }
}
$now = "?" . $_SERVER['QUERY_STRING']; // Get value for using in jQuery.
// Create new folder in current directory.
if (isset($_POST["crt"])) {
    $dirname = trim($_POST['f_name']);
    if (!empty($dirname)) {
        if (!is_dir($current_dir . $dirname)) {
            mkdir($current_dir . $dirname, 0755);
            echo "folder created";
        }
    } else {
        echo "folder not crated";
    }
}
// Upload file.
if (isset($_FILES['userfile'])) {
    $uploadfile = $current_dir . basename($_FILES['userfile']['name']);
    if ($uploadfile == $current_dir) {
        echo "file not selected for upload";
    } elseif (file_exists($uploadfile)) {
        echo "file isset";
    } elseif ($_FILES['name']['error'] == 'UPLOAD_ERR_FORM_SIZE') {
        echo "file to large for upload";
    } elseif (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
        echo $_FILES['userfile']['name'] . " was successfully uploaded";
    } else {
        echo "Error upload";
    }
}
// Download element.
if (isset($_GET["download"])) {
    $file = $_GET["download"];
    if (is_file($file)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($file) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;
    }
}
// Delete element.
if (isset($_POST["delete"])) {
    if (is_dir($current_dir . $_POST["delete"])) {
        rmdir($current_dir . $_POST["delete"]);
    } elseif (is_file($current_dir . $_POST["delete"])) {
        unlink($current_dir . $_POST["delete"]);
    } else {
        echo "Delete error";
    }
}
// Rename element.
if (isset($_POST["name"]) && isset($_POST["new_name"])) {
    $old_name = trim($_POST['name']);
    $old_name = $current_dir . $old_name;
    if (is_file($old_name) or is_dir($old_name)) {
        $new_name = $current_dir . $_POST["new_name"];
        if (!rename($old_name, $new_name)) {
            echo "Error renaming";
        }
    } else {
        echo "Error";
    }
}
// Copy element.
if (isset($_POST["copy"])) {
    $_SESSION["copy"] = $_POST["copy"];
    $_SESSION["old_dir"] = $current_dir;
}
if (isset($_POST["past"]) && isset($_SESSION["copy"])) {
    $old_dir = $_SESSION["old_dir"] . $_SESSION["copy"];
    $new_dir = $current_dir . $_SESSION["copy"];
    if (!copy($old_dir, $new_dir)) {
        echo "Copy error";
    }
    unset($_SESSION["copy"]);
    unset($_SESSION["old_dir"]);
}
// Cut element.
if (isset($_POST["cut"])) {
    $_SESSION["cut"] = $_POST["cut"];
    $_SESSION["old_dir"] = $current_dir;
}
if (isset($_POST["past"]) && isset($_SESSION["cut"])) {
    $old_dir = $_SESSION["old_dir"] . $_SESSION["cut"];
    $new_dir = $current_dir . $_SESSION["cut"];
    if (!rename($old_dir, $new_dir)) {
        echo "Cutting error";
    }
    unset($_SESSION["cut"]);
    unset($_SESSION["old_dir"]);
}
include "template.html";
