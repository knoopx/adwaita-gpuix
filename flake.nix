{
  description = "Adwaita (GTK4/libadwaita) component library for GPUIX apps";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      lib = nixpkgs.lib;
      pkgs = nixpkgs.legacyPackages.${system};

      # Cleaned source tree. This package is consumed as a local `file:`
      # workspace dependency by GPUIX apps (e.g. the hf-cache flake), so it
      # must be a plain directory containing package.json + src/.
      src =
        lib.cleanSourceWith {
          filter =
            path: type:
            let
              base = baseNameOf path;
            in
            base != "node_modules" && base != ".fallow";
          src = lib.cleanSource ./.;
        };
    in
    {
      packages.${system}.default =
        pkgs.stdenvNoCC.mkDerivation rec {
          pname = "adwaita-gpuix";
          version = "0.1.0";

          inherit src;

          dontBuild = true;

          installPhase = ''
            mkdir -p $out
            cp -r ./* $out/
          '';
        };

      devShells.${system}.default = pkgs.mkShell {
        packages = [ pkgs.bun ];
      };
    };
}
