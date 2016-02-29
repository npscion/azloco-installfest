<?php include 'search.php';
    $connect=mysqli_connect('localhost', 'root', '', 'installfest');
    $name = $_POST['name'];

    if() {
        if(mysqli_connect_errno($connect)) {
            echo 'Failed to connect';
        }
        $sql = "SELECT * FROM install_catalog where name = '$name'";
        $result = $connect->query($sql);

        if ($connect->query($sql) == TRUE) {
            "Success";
        } else {
            echo "Error";
        }

        if($result->num_rows >0){
            echo "<br>" . "Results for '" . $name . "':<br></br>";
            while($row = $result->fetch_assoc()){
                echo "Date: " . $row["submit_date"] . "<br>" .
                  " Name: " . $row["name"] . "<br>" .
                  " Helper Name: " . $row["helper_name"] . "<br>" .
                  " Email: " . $row["email"] . "<br>" .
                  " Computer Make: " . $row["computer_make"] . "<br>" .
                  " Computer Model Number: " . $row["computer_model_number"] . "<br>" .
                  " Memory Size: " . $row["memory_size"] . "<br>" .
                  " Disk Size: " . $row["disk_size"] . "<br>" .
                  " Disk Free Space: " . $row["disk_free_space"] . "<br>" .
                  " Backup: " . $row["backup"] . "<br>" .
                  " Current Operating System: " . $row["old_os"] . "<br>" .
                  " Requested Linux Version: " . $row["requested_os"] . "<br>" .
                  " User Confirmation: " . $row["user_confirmation"] . "<br>" .
                  " Lightweight Linux: " . $row["lightweight_linux"] . "<br>" .
                  " Resource List: " . $row["resource_list"] . "<br>" .
                  " Dualboot: " . $row["dual_boot"] . "<br>" .
                  " Disk Cleanup: " . $row["disk_cleanup"] . "<br>" .
                  " CPU Model Number: " . $row["cpu_model_number"] . "<br>" .
                  " GPU Model Number: " . $row["gpu_model_number"] . "<br>" .
                  " Wifi: " . $row["wifi"] . "<br>" .
                  " Wifi Model Number: " . $row["wifi_model_number"] . "<br>" .
                  " Ethernet: " . $row["ethernet"] . "<br>" .
                  " Ethernet Model Number: " . $row["ethernet_model_number"] . "<br>" .
                  " Installed Operating System: " . $row["installed_os"] . "<br>" .
                  " Installed Operating System Version: " . $row["installed_os_version"] . "<br>" .
                  " Notes: " . $row["notes"] . "<br></br>";
            }
        } else {
            echo "No records found";
        }

        $connect->close();
    }
include 'form_footer.php'; ?>
